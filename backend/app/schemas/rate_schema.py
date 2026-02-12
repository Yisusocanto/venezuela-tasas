from enum import Enum
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class RateSchemaBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    name: str
    rate: float
    currency_code: str = Field(alias="currencyCode")


class RateSchemaDB(RateSchemaBase):
    id: int
    date: datetime


class AvailableCurrencies(str, Enum):
    dolar = "dolar"
    euro = "euro"
    lira = "lira"
    rublo = "rublo"


class AllRatesResponse(BaseModel):
    dolar: RateSchemaDB
    euro: RateSchemaDB
    lira: RateSchemaDB
    rublo: RateSchemaDB


class RateListResponse(BaseModel):
    rates: list[RateSchemaDB]


class RateResponse(BaseModel):
    rate: RateSchemaDB
