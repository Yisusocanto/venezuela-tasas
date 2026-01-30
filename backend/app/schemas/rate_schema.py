from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class RateSchemaBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    name: str
    rate: float


class RateSchemaDB(RateSchemaBase):
    id: int
    date: datetime
