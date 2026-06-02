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
    print("Initializing app lifespan...")

    # Start scraping in the background so we don't block port binding
    # and cause Render to time out.
    def run_initial_scraping():
        try:
            print("Performing initial rate scraping in background...")
            rate_scraping()
            print("Initial rate scraping completed successfully.")
        except Exception as e:
            print(f"Error during initial rate scraping: {e}")

    # Use to_thread for the synchronous rate_scraping function
    asyncio.create_task(asyncio.to_thread(run_initial_scraping))

    try:
        loop = asyncio.get_running_loop()
        scheduler = AsyncIOScheduler(loop=loop)
        scheduler.add_job(rate_scraping, "cron", hour=12, minute=5)
        scheduler.start()
        print("Cron job scheduler started.")
    except Exception as e:
        print(f"Error starting scheduler: {e}")

    yield

    try:
        scheduler.shutdown(wait=False)
        print("Scheduler shut down.")
    except Exception as e:
        print(f"Error shutting down scheduler: {e}")

    print("Closing app lifespan...")


def create_app():
    app = FastAPI(
        title="Venezuela Tasas",
        description="API to check the dollar and other exchange rates in Venezuela",
        lifespan=lifespan,
        docs_url="/docs" if settings.DEBUG else None,
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


@app.head("/health", include_in_schema=False)
@app.get(
    "/health",
    tags=["Health"],
    summary="Check if the api is alive.",
    response_model=HealthResponse,
)
def health():
    return {"health": True}
