"""add unique budget per user month

Revision ID: 020c6cc5eee2
Revises: c2b0c6887b36
Create Date: 2026-08-21 23:59:31.210516

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '020c6cc5eee2'
down_revision: Union[str, Sequence[str], None] = 'c2b0c6887b36'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_unique_constraint(
        'unique_user_month_budget',
        'budgets',
        ['user_id', 'month', 'year']
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        'unique_user_month_budget',
        'budgets',
        type_='unique'
    )