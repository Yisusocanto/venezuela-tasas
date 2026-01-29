"""change created_at to timezone aware

Revision ID: change_timezone_aware
Revises: 243a12b0a2ca
Create Date: 2026-01-26 16:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'change_timezone_aware'
down_revision: Union[str, Sequence[str], None] = '243a12b0a2ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Cambiar la columna created_at de TIMESTAMP WITHOUT TIME ZONE a TIMESTAMP WITH TIME ZONE
    op.execute("""
        ALTER TABLE currencies 
        ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE 
        USING created_at AT TIME ZONE 'UTC';
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Revertir a TIMESTAMP WITHOUT TIME ZONE
    op.execute("""
        ALTER TABLE currencies 
        ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE 
        USING created_at AT TIME ZONE 'UTC';
    """)
