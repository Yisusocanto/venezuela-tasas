from enum import Enum
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class RateSchemaBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    name: str
    rate: float


class RateSchemaDB(RateSchemaBase):
    id: int
    date: datetime


class AvailableCurrencies(str, Enum):
    dolar = "dolar"
    euro = "euro"


class AllRatesResponse(BaseModel):
    dolar: RateSchemaDB
    euro: RateSchemaDB


class RateListResponse(BaseModel):
    rates: list[RateSchemaDB]


class RateResponse(BaseModel):
    rate: RateSchemaDB


class RateHistoryResponse(BaseModel):
    history: list[RateSchemaDB]
    results: int
