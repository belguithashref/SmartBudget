from passlib.context import CryptContext
from database import SessionLocal
from models import UserDB

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

db = SessionLocal()

try:
    email = input("Enter the user's email: ")
    new_password = input("Enter the new password: ")

    user = db.query(UserDB).filter(
        UserDB.email == email
    ).first()

    if user is None:
        print("User not found")
    else:
        user.password = pwd_context.hash(new_password)

        db.commit()

        print("Password successfully hashed!")

finally:
    db.close()