from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, Query, Depends
from sqlmodel import Session
from app.db.database import get_db
from app.schemas.schemas import (
    AvailableCurrencies,
    AllExchangeRatesResponse,
    ExchangeRateListResponse,
    ExchangeRateResponse,
)
from app.repositories.exchange_rate_repo import ExchangeRateRepository

rates_router = APIRouter()


@rates_router.get(
    "/",
    tags=["Rates"],
    summary="Get exchange rates for all currencies.",
    response_model=AllExchangeRatesResponse,
)
def rates(db: Session = Depends(get_db)):
    exchange_rate_repo = ExchangeRateRepository(db)

    exchange_rates = exchange_rate_repo.get_all_exchange_rates()
    return exchange_rates


@rates_router.get(
    "/{currency_name}",
    tags=["Rates"],
    summary="Get the current exchange rate for a specific currency.",
    response_model=ExchangeRateResponse,
)
def currency_rate(
    currency_name: Annotated[AvailableCurrencies, Path(title="Name of the currency.")],
    db: Session = Depends(get_db),
):
    exchange_rate_repo = ExchangeRateRepository(db)
    exchange_rate = exchange_rate_repo.get_currency_exchange_rate(
        currency_name=currency_name
    )
    if not exchange_rate:
        raise HTTPException(
            status_code=404, detail="There are not results for the specified currency."
        )

    return {"rate": exchange_rate}


@rates_router.get(
    "/{currency_name}/history",
    tags=["History"],
    summary="Obtains the exchange rates of a currency for the last 30 days.",
    response_model=ExchangeRateListResponse,
)
def rate_history(
    currency_name: Annotated[AvailableCurrencies, Path(title="Name of the currency.")],
    db: Session = Depends(get_db),
):
    exchange_rate_repo = ExchangeRateRepository(db)
    exchange_rate_list = exchange_rate_repo.get_exchange_rate_history(
        currency_name=currency_name
    )
    return {"rates": exchange_rate_list}


@rates_router.get(
    "/{currency_name}/history/date_range",
    tags=["History"],
    summary="Get the rate history for a date range.",
    response_model=ExchangeRateListResponse,
)
def rate_history_for_date_range(
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
    db: Session = Depends(get_db),
):
    exchange_rate_repo = ExchangeRateRepository(db)

    exchange_rate_list = exchange_rate_repo.get_exchange_rate_history_for_date_range(
        currency_name=currency_name, start_date=start_date, end_date=end_date
    )

    return {"rates": exchange_rate_list}


@rates_router.get(
    "/{currency_name}/history/{date}",
    tags=["History"],
    summary="Get the rate of a currency on a specific date",
    response_model=ExchangeRateListResponse,
)
def currency_rate_on_a_certain_date(
    currency_name: Annotated[AvailableCurrencies, Path(title="Currency name")],
    date: Annotated[
        str,
        Path(
            title="Date of the exchange rates to consult",
            examples=["2026-01-30", "2026-10-01"],
            pattern="^\d{4}-\d{2}-\d{2}$",
        ),
    ],
    db: Session = Depends(get_db),
):
    exchange_rate_repo = ExchangeRateRepository(db)

    exchange_rate = exchange_rate_repo.get_exchange_rate_on_a_certain_date(
        currency_name=currency_name, filter_date=date
    )
    if not exchange_rate:
        raise HTTPException(
            status_code=404,
            detail="There are no exchange rate results for the date shown.",
        )

    return {"rates": [exchange_rate]}
