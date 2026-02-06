from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import func, DateTime
from datetime import datetime, timezone
from app.db.base import Base


class Rate(Base):
    __tablename__ = "rates"

    id: Mapped[int] = mapped_column(
        primary_key=True, nullable=False, autoincrement=True, index=True
    )
    name: Mapped[str] = mapped_column(nullable=False, index=True)
    rate: Mapped[float] = mapped_column(nullable=False)
    currency_code: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now(),
    )
