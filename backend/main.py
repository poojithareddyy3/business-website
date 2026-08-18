from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Business website API is running!"}