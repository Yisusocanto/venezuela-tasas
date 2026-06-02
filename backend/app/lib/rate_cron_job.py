import logging

from sqlmodel import Session
from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed,
    retry_if_exception_type,
    before_sleep_log,
)
from app.db.database import engine
from app.repositories.exchange_rate_repo import ExchangeRateRepository
from app.services.bcv_rates import BcvRates

logger = logging.getLogger(__name__)


@retry(
    stop=stop_after_attempt(5),
    wait=wait_fixed(300),
    retry=retry_if_exception_type(Exception),
    before_sleep=before_sleep_log(logger, logging.WARNING),
)
def rate_scraping():
    rates = BcvRates.get_bcv_rates()
    if rates is None:
        print("Error getting the rates from bcv.")
        raise Exception("Error getting the rates from bcv.")

    try:
        with Session(engine) as session:
            exchange_rate_repo = ExchangeRateRepository(session)

            try:
                for rate in rates:
                    exchange_rate_repo.create_exchange_rate(
                        currency_name=rate.currency_name, exchange_rate=rate.rate
                    )
            except Exception as i:
                session.rollback()
                raise i

        return {"success": True}

    except Exception as e:
        print(f"Error on rate scraping: {e}")
        raise e
