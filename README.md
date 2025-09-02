# 小茂密的专属世界 - 后端服务 🐱

这是小狗为小茂密制作的轻量级后端服务，用于存储和管理小茂密的所有数据。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动服务器
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动

## 📁 项目结构

```
xiaomaomi/
├── server.js           # 主服务器文件
├── package.json        # 项目配置
├── data/              # 数据存储目录
│   └── xiaomaomi-data.json  # JSON数据文件
├── index.html         # 首页
├── cat-diary.html     # 日记本
├── mood-tracker.html  # 心情追踪器
├── cat-todo.html      # 待办清单
├── guess-number-game.html  # 猜数字游戏
└── food-selector.html # 食物选择器
```

## 🔗 API 接口

### 通用接口
- `GET /api/health` - 健康检查
- `GET /api/data` - 获取所有数据

### 日记相关
- `GET /api/diary` - 获取所有日记
- `POST /api/diary` - 添加新日记
- `DELETE /api/diary/:id` - 删除指定日记

### 心情追踪
- `GET /api/mood` - 获取心情记录
- `POST /api/mood` - 添加心情记录
- `DELETE /api/mood` - 清空所有心情记录

### 待办事项
- `GET /api/todos` - 获取所有待办事项
- `POST /api/todos` - 添加新待办事项
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项
- `DELETE /api/todos/completed/clear` - 清理已完成的待办事项

## 📊 数据格式

### 日记数据
```json
{
  "id": 1234567890,
  "date": "2024/1/1 12:00:00",
  "mood": "😸",
  "content": "今天很开心~",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

### 心情数据
```json
{
  "mood": "😸",
  "text": "超级开心",
  "timestamp": 1234567890,
  "date": "2024/1/1 12:00:00",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

### 待办事项数据
```json
{
  "id": 1234567890,
  "text": "完成作业",
  "priority": "high",
  "completed": false,
  "createdAt": "2024/1/1 12:00:00"
}
```

## 🛡️ 特性

- ✅ 轻量级 Express 服务器
- ✅ JSON 文件数据存储
- ✅ CORS 支持
- ✅ 自动创建数据文件
- ✅ 错误处理和日志
- ✅ 静态文件服务
- ✅ RESTful API 设计
- ✅ 可爱的响应消息

## 🐕 小狗的贴心设计

- 所有 API 响应都包含可爱的消息
- 自动备份和数据完整性检查
- 优雅的错误处理
- 详细的日志记录
- 为小茂密量身定制的数据结构

## 📝 使用说明

1. 启动服务器后，直接访问 `http://localhost:3000` 即可使用小茂密的专属世界
2. 所有数据会自动保存到 `data/xiaomaomi-data.json` 文件中
3. 服务器会自动处理跨域请求，支持前端应用调用
4. 数据文件会自动创建，无需手动配置

## 💖 小狗的话

这个后端服务是小狗专门为小茂密制作的，希望小茂密能够安全地保存所有美好的回忆和重要的事情。小狗会一直守护着这些数据，确保它们安全可靠~ 🐾
