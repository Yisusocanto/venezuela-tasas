from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, Query
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.repositories.rate import RateRepository
from app.schemas import (
    RateResponse,
    RateListResponse,
    AvailableCurrencies,
    AllRatesResponse,
)

rates_router = APIRouter()


@rates_router.get(
    "/",
    tags=["Rates"],
    summary="Get the rates of the currencies",
    response_model=AllRatesResponse,
)
async def rates(db: AsyncSession = Depends(get_db)):
    rate_repo = RateRepository(db)

    rate_list = await rate_repo.get_all_rates()
    rates_by_name = {rate["name"]: rate for rate in rate_list}
    return rates_by_name


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
    response_model=RateListResponse,
)
async def rate_history(
    currency_name: Annotated[AvailableCurrencies, Path(title="Name of the currency.")],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)
    rate_history_list = await rate_repo.get_rate_history(currency_name=currency_name)
    return {"rates": rate_history_list}


@rates_router.get(
    "/{currency_name}/date/{date}",
    tags=["Rate History"],
    summary="Get the rate of a currency on a specific date",
    response_model=RateListResponse,
)
async def currency_rate_on_a_certain_date(
    currency_name: Annotated[AvailableCurrencies, Path(title="Currency name")],
    date: Annotated[
        str,
        Path(
            title="Date of the exchange rates to consult",
            examples=["2026-01-30", "2026-10-01"],
            pattern="^\d{4}-\d{2}-\d{2}$",
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

    return {"rates": [rate]}


@rates_router.get(
    "/{currency_name}/rate_history_for_date_range",
    tags=["Rate History"],
    summary="Get the rate history for a date range.",
    response_model=RateListResponse,
)
async def rate_history_for_date_range(
    currency_name: Annotated[AvailableCurrencies, Path(title="Currency name.")],
    start_date: Annotated[
        str,
        Query(
            title="Start date of the exchange rates to consult",
            examples=["2026-01-30"],
            pattern="^\d{4}-\d{2}-\d{2}$",
        ),
    ],
    end_date: Annotated[
        str,
        Query(
            title="End date of the exchange rates to consult",
            examples=["2026-02-10"],
            pattern="^\d{4}-\d{2}-\d{2}$",
        ),
    ],
    db: AsyncSession = Depends(get_db),
):
    rate_repo = RateRepository(db)

    try:
        start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
        end_datetime = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError as v:
        print(f"Error on rate_history_for_date_range: {v}")
        raise HTTPException(status_code=400, detail="Invalid date.")

    rate_list = await rate_repo.get_rate_history_for_date_range(
        currency_name=currency_name, start_date=start_datetime, end_date=end_datetime
    )

    return {"rates": rate_list}
