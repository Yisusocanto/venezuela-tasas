from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field

class UpdateSchema(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

    last_update: datetime = Field(alias="lastUpdate", default_factory=lambda: datetime.now(timezone.utc))