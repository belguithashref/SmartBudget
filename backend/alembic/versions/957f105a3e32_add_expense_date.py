"""add expense date

Revision ID: 957f105a3e32
Revises: 6d6fc9c43a25
Create Date: 2026-08-21 01:45:09.910466

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '957f105a3e32'
down_revision: Union[str, Sequence[str], None] = '6d6fc9c43a25'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add expense_date temporarily as nullable
    op.add_column(
        'expenses',
        sa.Column('expense_date', sa.Date(), nullable=True)
    )

    # Give existing expenses today's date
    op.execute(
        "UPDATE expenses SET expense_date = CURRENT_DATE"
    )

    # Make expense_date required
    op.alter_column(
        'expenses',
        'expense_date',
        existing_type=sa.Date(),
        nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        'expenses',
        'expense_date'
    )
