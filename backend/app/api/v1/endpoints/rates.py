from datetime import datetime, timezone, timedelta
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
from app.schemas import (
    RateResponse,
    RateHistoryResponse,
    RateListResponse,
    AvailableCurrencies,
)

rates_router = APIRouter()


@rates_router.get(
    "/",
    tags=["Rates"],
    summary="Get the rates of the currencies",
    response_model=RateListResponse,
)
async def rates(db: AsyncSession = Depends(get_db)):
    rate_repo = RateRepository(db)

    rate_list = await rate_repo.get_all_rates()
    return {"rates": rate_list}


@rates_router.get(
    "/{currency_name}",
    tags=["Currency Rate"],
    summary="Get the current exchange rate for a specific currency.",
    response_model=RateResponse,
)
async def currency_rate(
    currency_name: Annotated[AvailableCurrencies, Path(title="Name of the currency.")],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)
    rate = await rate_repo.get_currency_rate(currency_name=currency_name)
    if not rate:
        raise HTTPException(
            status_code=404, detail="There are not results for the specified currency."
        )

    return {"rate": rate}


@rates_router.get(
    "/{currency_name}/history",
    tags=["Rate History"],
    summary="Get the records of the last month for a specific currency",
    response_model=RateHistoryResponse,
)
async def rate_history(
    currency_name: Annotated[AvailableCurrencies, Path(title="Name of the currency.")],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)
    rate_history_list = await rate_repo.get_rate_history(currency_name=currency_name)
    return {"history": rate_history_list, "results": len(rate_history_list)}


@rates_router.get(
    "/{currency_name}/{date}",
    tags=["Rate History"],
    summary="Get the rate of a currency on a specific date",
    response_model=RateResponse,
)
async def currency_rate_on_a_certain_date(
    currency_name: Annotated[AvailableCurrencies, Path(title="Currency name")],
    date: Annotated[
        str,
        Path(
            title="Date of the exchange rates to consult",
            examples=["2026-01-30", "2026-10-01"],
        ),
    ],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)

    try:
        date_datetime = datetime.strptime(date, "%Y-%m-%d")
    except ValueError as v:
        print(f"Value error on currency_rate_on_a_certain_date: {v}")
        raise HTTPException(status_code=400, detail="The entered date is not valid.")

    rate = await rate_repo.get_currency_rate_on_a_certain_date(
        currency_name=currency_name, date=date_datetime
    )
    if not rate:
        raise HTTPException(
            status_code=404,
            detail="There are no exchange rate results for the date shown.",
        )

    return {"rate": rate}
