
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.update import Update
from app.schemas.update_schema import UpdateSchema


class UpdateRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_update_record(self):
        new_update_record = Update()
        self.db.add(new_update_record)
        await self.db.commit()
        return UpdateSchema.model_validate(new_update_record).model_dump()

    async def get_last_update(self):
        result = await self.db.execute(select(Update).order_by(Update.last_update.desc()).limit(1))
        return result.scalar_one_or_none()