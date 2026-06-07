# 租房看房记录 (pdd-168)

全栈租房看房记录应用，支持房源管理、看房笔记、评分排序、对比功能和签约提醒。

## 项目结构

```
pdd-168/
├── frontend/     # React 18 + TypeScript + Vite + TailwindCSS
└── backend/      # Node.js + Express + SQLite
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 后端

```bash
cd backend
npm install
npm run dev
```

后端运行在 http://localhost:3000

## 功能特性

- 用户注册/登录
- 房源添加（地址、租金、户型、面积、照片、房东联系方式）
- 看房笔记记录（采光、噪音、交通、周边配套、综合评分）
- 列表排序（评分高低、时间先后）
- 筛选（租金范围、区域）
- 房源对比（选两三个并列显示）
- 收藏心仪房源
- 签约提醒
- 状态管理（在看中/已收藏/已签约）
