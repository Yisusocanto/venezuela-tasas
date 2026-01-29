from datetime import datetime, timezone
from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Update(Base):
    __tablename__ = "updates"

    id: Mapped[int] = mapped_column(
        primary_key=True, nullable=False, autoincrement=True, index=True
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )
