import logging
from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed,
    retry_if_exception_type,
    before_sleep_log,
)
from app.db.database import AsyncSessionLocal
from app.repositories.rate import RateRepository
from app.repositories.update import UpdateRepository
from app.services.bcv_rates import BcvRates

logger = logging.getLogger(__name__)


@retry(
    stop=stop_after_attempt(5),
    wait=wait_fixed(300),
    retry=retry_if_exception_type(Exception),
    before_sleep=before_sleep_log(logger, logging.WARNING),
)
async def rate_scraping():
    rates = BcvRates.get_bcv_rates()
    if rates is None:
        print("Error getting the rates from bcv.")
        raise Exception("Error getting the rates from bcv.")

    try:
        async with AsyncSessionLocal() as session:
            rate_repo = RateRepository(session)
            update_repo = UpdateRepository(session)

            for rate in rates:
                await rate_repo.create_rate_record(rate=rate)

            await update_repo.create_update_record()

        return {"success": True}
    except Exception as e:
        print(f"Error on rate_scraping: {e}")
        raise Exception(f"Error on rate_scraping: {e}")
