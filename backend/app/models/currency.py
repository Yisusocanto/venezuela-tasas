from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .exchange_rate import ExchangeRate


class CurrencyBase(SQLModel):
    name: str
    code: str


class Currency(CurrencyBase, table=True):
    id: int | None = Field(default=None, primary_key=True, nullable=False)

    exchange_rates: list["ExchangeRate"] = Relationship(
        back_populates="currency", cascade_delete=True
    )
