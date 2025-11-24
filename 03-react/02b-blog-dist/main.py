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


# 1. 確保 dist 資料夾存在
if os.path.exists("dist"):
    # 2. 掛載靜態資源 (assets)
    # Vite 打包後的 JS/CSS 通常在 dist/assets 裡
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    # 3. 處理所有其他路由 (SPA 關鍵)
    # 無論使用者訪問 /, /new, 還是 /post/1，都回傳 index.html
    # 這樣 React Router 才能接手處理畫面
    @app.get("/{catchall:path}")
    async def serve_react_app(catchall: str):
        # 如果請求的是具體存在的檔案 (例如 favicon.ico)，就直接回傳
        file_path = os.path.join("dist", catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # 否則回傳 index.html
        return FileResponse("dist/index.html")
else:
    print("警告: 找不到 dist 資料夾，請先執行 npm run build")
