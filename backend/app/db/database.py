from sqlmodel import create_engine, Session

from app.core.config import settings

# Import all models here for Alembic to discover them
from app.models import ExchangeRate, Currency

connect_args = {}

if not settings.DEBUG:
    # 'require' es el estándar para conexiones seguras en producción (como en Render/Heroku/AWS)
    connect_args["sslmode"] = "require"

engine = create_engine(
    settings.DATABASE_URL,
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
