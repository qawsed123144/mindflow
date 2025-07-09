


# Mindflow 專案

Mindflow 是一個結合心智圖與專案管理，讓使用者能以視覺化方式規劃專案架構，同時具備協作與進度追蹤功能。
本專案後端採用 Mongoose 技術操作 MongoDB 資料庫，提供資料存取與管理能力。
專案以 Next.js 為前端、Express 為後端，後端透過 Mongoose 操作 MongoDB，支援部署至 Vercel 平台。

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


### 🔐 backend/.env 範例

```env
PORT=4000
MONGO_URI=你的 MongoDB Atlas URI（例如 mongodb+srv://...）
JWT_SECRET=你的 JWT 加密密鑰
```

### 🗄️ MongoDB 資料庫設定

本專案使用 MongoDB Atlas 作為雲端資料庫，並透過 Mongoose 套件進行連接與操作。

- 建議使用 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 建立免費叢集
- 建立資料庫後，請前往「Database Access」新增使用者帳密
- 在「Network Access」中開啟 0.0.0.0/0 以允許 Railway/Vercel 等雲端平台存取
- 獲取連線字串並填入 `.env` 中的 `MONGO_URI` 欄位

## 📌 注意事項

- 請勿將 `node_modules/`、`.env`、`.next/` 等目錄加入版本控制
- 使用 GitHub 進行版本管理，請先建立 repo 並連結後再 push

## 🙌 貢獻與授權

歡迎貢獻改進本專案。授權條款依據實際需求補充。