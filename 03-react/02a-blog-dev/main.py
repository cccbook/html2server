from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware # 新增
from pydantic import BaseModel
import os

app = FastAPI()

# --- 新增 CORS 設定 ---
# 允許來自 React 開發伺服器的請求
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------

# 假設的資料
posts = [
    {"id": 0, "title": "aaa", "body": "aaaaa"},
    {"id": 1, "title": "bbb", "body": "bbbbb"}
]

class Post(BaseModel):
    title: str
    body: str

@app.get("/list")
async def list_posts():
    return JSONResponse(content=posts)

@app.get("/post/{id}")
async def show_post(id: int):
    # 注意：前端傳來的 id 可能是字串，這裡做個防呆轉換
    id = int(id)
    if id < 0 or id >= len(posts):
        raise HTTPException(status_code=404, detail="Invalid post id")
    return JSONResponse(content=posts[id])

@app.post("/post")
async def create_post(post: Post):
    new_post = post.dict()
    new_post["id"] = len(posts)
    posts.append(new_post)
    return {"message": "success", "post": new_post}
