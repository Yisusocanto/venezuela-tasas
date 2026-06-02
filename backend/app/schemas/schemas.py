from pydantic import BaseModel, ConfigDict
from app.models.exchange_rate import ExchangeRateBase
from app.models.currency import CurrencyBase
from enum import Enum


class AvailableCurrencies(str, Enum):
    dolar = "dolar"
    euro = "euro"
    lira = "lira"
    rublo = "rublo"


class ExchangeRateWithCurrency(ExchangeRateBase):
    currency: CurrencyBase


class CurrencyWithExchangeRates(CurrencyBase):
    exchange_rates: list[ExchangeRateBase]


class AllExchangeRatesResponse(BaseModel):
    dolar: ExchangeRateWithCurrency
    euro: ExchangeRateWithCurrency
    lira: ExchangeRateWithCurrency
    rublo: ExchangeRateWithCurrency


class ExchangeRateResponse(BaseModel):
    rate: ExchangeRateWithCurrency


class ExchangeRateListResponse(BaseModel):
    rates: list[ExchangeRateWithCurrency]


class BCVRate(BaseModel):
    model_config = ConfigDict(use_enum_values=True)
    rate: str
    currency_name: AvailableCurrencies
