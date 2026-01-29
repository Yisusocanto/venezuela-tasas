from fastapi import APIRouter
from app.api.v1.endpoints.rates import rates_router

v1_routes = APIRouter()

v1_routes.include_router(rates_router, prefix="/rates")