# !/bin/bash
# 建置 React 專案
cd react
npm run build
cd ..
cp -r react/dist dist
# 啟動伺服器
fastapi run main.py