# Blog -- React 版

本專案由 ccc 指揮 gemini 3.0 pro 從 fetchapi 版的 blog 改寫過來

* 交談過程 -- https://gemini.google.com/app/4d3c09437db48de8

## 啟動方法

server： 在 blog 下執行

```
$ fastapi dev main.py
```

client: 在 react_blog 下執行

```
npm run dev
```

## 建置方法

將 react 打包，創建 dist 資料夾

```
npm run build
```

然後把 react_blog/dist 複製到 上層的 dist 底下
