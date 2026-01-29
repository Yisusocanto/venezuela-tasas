from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from app.schemas.rate_schema import RateSchemaBase, RateSchemaDB
from app.models.rate import Rate


class RateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_rate_record(self, rate: RateSchemaBase):
        new_rate_record = Rate(name=rate.name, rate=rate.rate)
        self.db.add(new_rate_record)
        await self.db.flush()
        await self.db.refresh(new_rate_record)

        return RateSchemaDB.model_validate(new_rate_record).model_dump()

    async def get_all_rates(self):
        # Get the latest record for each currency name
        subquery = (
            select(
                Rate.name,
                func.max(Rate.date).label('max_date')
            )
            .group_by(Rate.name)
            .subquery()
        )
        
        result = await self.db.execute(
            select(Rate)
            .join(
                subquery,
                (Rate.name == subquery.c.name) & 
                (Rate.date == subquery.c.max_date)
            )
            .order_by(Rate.name)
        )
        currencies = result.scalars().all()
        
        return [RateSchemaDB.model_validate(currency).model_dump(by_alias=True) for currency in currencies]
