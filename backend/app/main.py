from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.trends import trends_result
from app.analysis import analysis_result

app = FastAPI()

# CORS Middleware untuk mendukung frontend seperti React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model untuk validasi input data
class TrendsRequest(BaseModel):
    keyword: str
    sitename: str
    competitors: list[str]

class AnalysisRequest(BaseModel):
    sitename: str

@app.get("/")
async def index():
    return {"message": "Welcome to the API"}

@app.get("/health")
def healthcheck():
    return {"status": "ok"}

@app.post("/trends-result")
async def trends_post(data: TrendsRequest):
    try:
        response_data = trends_result(data)
        return JSONResponse(content=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analysis-result")
async def analysis_post(data: AnalysisRequest):
    try:
        response_data = analysis_result(data.sitename)
        return JSONResponse(content=response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
