from zoneinfo import ZoneInfo
from fastapi import APIRouter, HTTPException
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

@rates_router.get("/", tags=["Rates"], summary="Get the rates of the currencies", response_model=RatesResponse)
async def rates(db: AsyncSession = Depends(get_db)):
    rate_repo = RateRepository(db)

    rates = await rate_repo.get_all_rates()
    return {"rates": rates}



