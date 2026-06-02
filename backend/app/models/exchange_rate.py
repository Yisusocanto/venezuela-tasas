from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import TYPE_CHECKING, Optional
from decimal import Decimal

if TYPE_CHECKING:
    from .currency import Currency


class ExchangeRateBase(SQLModel):
    exchange_rate: Decimal = Field(
        default=0.00,
        max_digits=10,
        decimal_places=2,
        serialization_alias="exchangeRate",
    )
    creation_date: date = Field(
        default_factory=lambda: date.today(), serialization_alias="creationDate"
    )


class ExchangeRate(ExchangeRateBase, table=True):
    id: int | None = Field(default=None, primary_key=True, nullable=False)
    currency_id: int = Field(
        foreign_key="currency.id", serialization_alias="currencyID"
    )
    currency: Optional["Currency"] = Relationship(back_populates="exchange_rates")
