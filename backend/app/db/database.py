from sqlmodel import create_engine, Session
from app.core.config import settings

# Import all models here for Alembic to discover them
from app.models import ExchangeRate, Currency

database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
elif database_url.startswith("postgresql+asyncpg://"):
    database_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)

print(f"Using database URL: {database_url.split('@')[-1]}") # Debug only host/db

connect_args = {}

if not settings.DEBUG:
    # 'require' es el estándar para conexiones seguras en producción (como en Render/Heroku/AWS)
    connect_args["sslmode"] = "require"

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args=connect_args,
)


def get_db():
    with Session(engine) as session:
        try:
            yield session
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
