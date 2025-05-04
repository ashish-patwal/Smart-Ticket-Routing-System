from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
async def read_root():
    return JSONResponse(content={"message": "Hello, World!"})

@app.get("/hello")
async def read_hello():
    return JSONResponse(content={"message": "Hello, World!"})

@app.get("/hello/{name}")
async def read_hello_name(name: str):
    return JSONResponse(content={"message": f"Hello, {name}!"})


