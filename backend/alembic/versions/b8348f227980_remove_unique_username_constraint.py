"""remove unique username constraint

Revision ID: b8348f227980
Revises:
Create Date: 2026-08-20 02:20:31.393513
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "b8348f227980"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove the unique constraint from username."""
    op.drop_constraint(
        "users_username_key",
        "users",
        type_="unique"
    )


def downgrade() -> None:
    """Restore the unique constraint to username."""
    op.create_unique_constraint(
        "users_username_key",
        "users",
        ["username"]
    )