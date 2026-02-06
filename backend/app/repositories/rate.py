from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from app.schemas.rate_schema import RateSchemaBase, RateSchemaDB
from app.models.rate import Rate
from app.schemas import AvailableCurrencies


class RateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_rate_record(self, rate: RateSchemaBase):
        new_rate_record = Rate(
            name=rate.name, rate=rate.rate, currency_code=rate.currency_code
        )
        self.db.add(new_rate_record)
        await self.db.flush()
        await self.db.refresh(new_rate_record)

        return RateSchemaDB.model_validate(new_rate_record).model_dump()

    async def get_all_rates(self):
        # Get the latest record for each currency name
        subquery = (
            select(Rate.name, func.max(Rate.date).label("max_date"))
            .group_by(Rate.name)
            .subquery()
        )

        result = await self.db.execute(
            select(Rate)
            .join(
                subquery,
                (Rate.name == subquery.c.name) & (Rate.date == subquery.c.max_date),
            )
            .order_by(Rate.name)
        )
        currencies = result.scalars().all()

        return [
            RateSchemaDB.model_validate(currency).model_dump()
            for currency in currencies
        ]

    async def get_currency_rate(self, currency_name: str) -> RateSchemaDB | None:
        result = await self.db.execute(
            select(Rate)
            .where(Rate.name == currency_name)
            .order_by(desc(Rate.date))
            .limit(1)
        )
        rate = result.scalar_one_or_none()
        return RateSchemaDB.model_validate(rate).model_dump() if rate else None

    async def get_currency_rate_on_a_certain_date(
        self, currency_name: AvailableCurrencies, date: datetime
    ) -> RateSchemaDB | None:
        start_date = datetime(
            date.year,
            date.month,
            date.day,
            tzinfo=timezone.utc,
        )
        end_date = start_date + timedelta(days=1)

        result = await self.db.execute(
            select(Rate)
            .where(
                Rate.name == currency_name,
                Rate.date >= start_date,
                Rate.date <= end_date,
            )
            .order_by(desc(Rate.date))
            .limit(1)
        )
        rate = result.scalar_one_or_none()
        return RateSchemaDB.model_validate(rate).model_dump() if rate else None

    async def get_rate_history(
        self, currency_name: AvailableCurrencies
    ) -> list[RateSchemaDB] | list:
        last_month = datetime.now(timezone.utc) - timedelta(days=30)
        result = await self.db.execute(
            select(Rate)
            .where(Rate.name == currency_name, Rate.date >= last_month)
            .order_by(desc(Rate.date))
            .limit(30)
        )
        rates = result.scalars().all()
        return (
            [RateSchemaDB.model_validate(rate).model_dump() for rate in rates]
            if rates
            else []
        )

    async def get_rate_history_for_date_range(
        self,
        currency_name: AvailableCurrencies,
        start_date: datetime,
        end_date: datetime,
    ) -> list[RateSchemaDB] | list:
        start_datetime = datetime(
            start_date.year, start_date.month, start_date.day, tzinfo=timezone.utc
        )
        end_datetime = datetime(
            end_date.year, end_date.month, end_date.day, tzinfo=timezone.utc
        ) + timedelta(days=1)

        result = await self.db.execute(
            select(Rate)
            .where(
                Rate.name == currency_name,
                Rate.date >= start_datetime,
                Rate.date <= end_datetime,
            )
            .order_by(desc(Rate.date))
        )

        rates = result.scalars().all()

        return [RateSchemaDB.model_validate(rate) for rate in rates] if rates else []
