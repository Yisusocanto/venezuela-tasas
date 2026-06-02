from sqlmodel import select, desc, Session
from app.models import ExchangeRate, Currency
from app.schemas.schemas import ExchangeRateWithCurrency, AllExchangeRatesResponse

currencies_name = ["dolar", "euro", "lira", "rublo"]


class ExchangeRateRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_exchange_rate(
        self, currency_name: str, exchange_rate: str
    ) -> ExchangeRateWithCurrency:
        statement = select(Currency).where(Currency.name == currency_name)
        currency = self.db.exec(statement).first()
        if not currency:
            raise Exception("Currency does not exist.")

        new_rate = ExchangeRate(exchange_rate=exchange_rate, currency_id=currency.id)
        self.db.add(new_rate)
        self.db.commit()
        self.db.refresh(new_rate)
        return ExchangeRateWithCurrency.model_validate(new_rate)

    def get_all_exchange_rates(self) -> AllExchangeRatesResponse:
        exchange_rates = {}

        for currency_name in currencies_name:
            stmt = (
                select(ExchangeRate)
                .join(Currency)
                .where(Currency.name == currency_name)
                .order_by(desc(ExchangeRate.creation_date))
            )
            rate = self.db.exec(stmt).first()
            exchange_rates[currency_name] = rate

        return AllExchangeRatesResponse.model_validate(exchange_rates)

    def get_currency_exchange_rate(
        self, currency_name: str
    ) -> ExchangeRateWithCurrency | None:
        stmt = (
            select(ExchangeRate)
            .join(Currency)
            .where(Currency.name == currency_name)
            .order_by(desc(ExchangeRate.creation_date))
            .limit(1)
        )
        rate = self.db.exec(stmt).first()
        if not rate:
            return None
        return ExchangeRateWithCurrency.model_validate(rate)

    def get_exchange_rate_history(
        self, currency_name: str
    ) -> list[ExchangeRateWithCurrency]:
        stmt = (
            select(ExchangeRate)
            .join(Currency)
            .where(Currency.name == currency_name)
            .distinct(ExchangeRate.creation_date)
            .order_by(desc(ExchangeRate.creation_date))
            .limit(30)
        )
        exchange_rates = self.db.exec(stmt).all()
        return (
            [ExchangeRateWithCurrency.model_validate(e) for e in exchange_rates]
            if exchange_rates
            else []
        )

    def get_exchange_rate_on_a_certain_date(
        self, currency_name: str, filter_date: str
    ) -> ExchangeRateWithCurrency | None:

        stmt = (
            select(ExchangeRate)
            .join(Currency)
            .where(
                Currency.name == currency_name,
                ExchangeRate.creation_date == filter_date,
            )
        )
        exchange_rate = self.db.exec(stmt).first()
        return (
            ExchangeRateWithCurrency.model_validate(exchange_rate)
            if exchange_rate
            else None
        )

    def get_exchange_rate_history_for_date_range(
        self, currency_name: str, start_date: str, end_date: str
    ) -> list[ExchangeRateWithCurrency] | list:
        stmt = (
            select(ExchangeRate)
            .join(Currency)
            .where(
                Currency.name == currency_name,
                ExchangeRate.creation_date >= start_date,
                ExchangeRate.creation_date <= end_date,
            )
        )
        exchange_rates = self.db.exec(stmt).all()
        return (
            [ExchangeRateWithCurrency.model_validate(e) for e in exchange_rates]
            if exchange_rates
            else []
        )
