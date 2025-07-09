


# Mindflow 專案

Mindflow 是一個結合心智圖與專案管理，讓使用者能以視覺化方式規劃專案架構，同時具備協作與進度追蹤功能。
專案以 Next.js 為前端、Express 為後端，支援部署至 Vercel 平台。

## 📁 專案結構

```
.
├── frontend/   # Next.js 前端應用
└── backend/    # Express 後端 API
```

## 🚀 快速開始

### 安裝依賴

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 本地啟動

- 前端 (http://localhost:3000)：
  ```bash
  cd frontend
  npm run dev
  ```

- 後端 (http://localhost:5000 或設定的 PORT)：
  ```bash
  cd backend
  npm start
  ```

## 🛠️ 部署

- 前端建議部署於 [Vercel](https://vercel.com/)
- 後端建議部署於 [Render](https://render.com/)、[Railway](https://railway.app/) 或其他 Node.js 支援平台

## 📄 環境變數

請分別在 `frontend/.env` 和 `backend/.env` 中設定必要的環境變數，並記得將其加入 `.gitignore`。

## 📌 注意事項

- 請勿將 `node_modules/`、`.env`、`.next/` 等目錄加入版本控制
- 使用 GitHub 進行版本管理，請先建立 repo 並連結後再 push

## 🙌 貢獻與授權

歡迎貢獻改進本專案。授權條款依據實際需求補充。