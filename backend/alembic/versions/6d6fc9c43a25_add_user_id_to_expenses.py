"""add user_id to expenses

Revision ID: 6d6fc9c43a25
Revises: b8348f227980
Create Date: 2026-08-21 00:40:08.270201

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d6fc9c43a25'
down_revision: Union[str, Sequence[str], None] = 'b8348f227980'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add user_id temporarily as nullable
    op.add_column(
        'expenses',
        sa.Column('user_id', sa.Integer(), nullable=True)
    )

    # Assign all existing expenses to user ID 1
    op.execute(
        "UPDATE expenses SET user_id = 1"
    )

    # Make user_id required
    op.alter_column(
        'expenses',
        'user_id',
        existing_type=sa.Integer(),
        nullable=False
    )

    # Create the relationship between expenses and users
    op.create_foreign_key(
        None,
        'expenses',
        'users',
        ['user_id'],
        ['id']
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        None,
        'expenses',
        type_='foreignkey'
    )

    op.drop_column(
        'expenses',
        'user_id'
    )
