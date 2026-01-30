from typing import Literal, Annotated
from zoneinfo import ZoneInfo
from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.repositories.rate import RateRepository
from app.services.bcv_rates import BcvRates
from app.repositories.update import UpdateRepository
from app.schemas.rate_schema import RateSchemaDB

rates_router = APIRouter()


class RatesResponse(BaseModel):
    rates: list[RateSchemaDB]


class CurrencyResponse(BaseModel):
    rate: RateSchemaDB


class HistoryResponse(BaseModel):
    history: list[RateSchemaDB]
    results: int


@rates_router.get(
    "/",
    tags=["Rates"],
    summary="Get the rates of the currencies",
    response_model=RatesResponse,
)
async def rates(db: AsyncSession = Depends(get_db)):
    rate_repo = RateRepository(db)

    rates = await rate_repo.get_all_rates()
    return {"rates": rates}


@rates_router.get(
    "/{currency_name}",
    tags=["Currency Rate"],
    summary="Get the current exchange rate for a specific currency.",
    response_model=CurrencyResponse,
)
async def currency_rate(
    currency_name: Annotated[
        Literal["dolar", "euro"], Path(title="Name of the currency.")
    ],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)
    rate = await rate_repo.get_currency_rate(currency_name=currency_name)
    return {"rate": rate}


@rates_router.get(
    "/{currency_name}/history",
    tags=["Rate History"],
    summary="Get the records of the last month for a specific currency",
    response_model=HistoryResponse,
)
async def rate_history(
    currency_name: Annotated[
        Literal["dolar", "euro"], Path(title="Name of the currency.")
    ],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)
    rate_history_list = await rate_repo.get_rate_history(currency_name=currency_name)
    return {"history": rate_history_list, "results": len(rate_history_list)}
