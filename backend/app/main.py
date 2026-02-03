import asyncio
from contextlib import asynccontextmanager
from pydantic import BaseModel
from app.lib.rate_cron_job import rate_scraping
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.v1_routes import v1_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing app...")

    print("Database initialized.")

    await rate_scraping()

    loop = asyncio.get_running_loop()
    scheduler = AsyncIOScheduler(loop=loop)
    scheduler.add_job(rate_scraping, "cron", hour=12, minute=5)
    scheduler.start()

    print("cron job initialized.")

    yield

    scheduler.shutdown(wait=False)

    print("Closing app...")


def create_app():
    app = FastAPI(
        title="Dolar Venezuela",
        description="API to consult the dolar in Venezuela",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_headers=["*"],
        allow_methods=["*"],
    )

    app.include_router(v1_routes, prefix="/api/v1")

    return app


app = create_app()


class HealthResponse(BaseModel):
    health: bool


@app.get(
    "/health",
    tags=["Health"],
    summary="Check if the api is alive.",
    response_model=HealthResponse,
)
def health():
    return {"health": True}
