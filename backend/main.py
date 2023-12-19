from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",  # Local
    "https://kissa-web.jollymoss-4112728e.uksouth.azurecontainerapps.io"  # Remote
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World, a change on dev"}

