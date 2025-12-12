from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, cycles, symptoms, stats, ai, health

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])


# from app.api.v1.endpoints import cycles

api_router.include_router(cycles.router)


api_router.include_router(symptoms.router, tags=["Symptoms"]) 
api_router.include_router(stats.router, prefix="/stats", tags=["Stats"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
from app.api.v1.endpoints import health

api_router.include_router(
    health.router,
)

from app.api.v1.endpoints import ai

api_router.include_router(ai.router)
