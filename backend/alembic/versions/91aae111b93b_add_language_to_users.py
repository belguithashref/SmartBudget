"""add language to users

Revision ID: 91aae111b93b
Revises: 020c6cc5eee2
Create Date: 2026-08-22 23:09:54.117471

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91aae111b93b'
down_revision: Union[str, Sequence[str], None] = '020c6cc5eee2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'language',
            sa.String(),
            nullable=False,
            server_default='en'
        )
    )


def downgrade() -> None:
    op.drop_column('users', 'language')
