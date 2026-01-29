"""Update table added.

Revision ID: c9edfde58d51
Revises: change_timezone_aware
Create Date: 2026-01-27 11:08:26.444381

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c9edfde58d51'
down_revision: Union[str, Sequence[str], None] = 'change_timezone_aware'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Crear tabla 'updates' sin tocar la tabla 'currencies'
    op.create_table(
        'updates',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('last_update', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    """Downgrade schema."""
    # El downgrade elimina solo la tabla 'updates'
    op.drop_table('updates')
