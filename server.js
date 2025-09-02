const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data', 'xiaomaomi-data.json');

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（为前端页面提供服务）
app.use(express.static(__dirname));

// 确保数据目录和文件存在
async function ensureDataFile() {
    try {
        await fs.ensureDir(path.dirname(DATA_FILE));
        
        // 检查文件是否存在，如果不存在则创建默认数据
        if (!(await fs.pathExists(DATA_FILE))) {
            const defaultData = {
                diary: [],
                mood: [],
                todos: [],
                settings: {
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }
            };
            await fs.writeJson(DATA_FILE, defaultData, { spaces: 2 });
            console.log('📝 创建了新的数据文件');
        }
    } catch (error) {
        console.error('❌ 初始化数据文件失败:', error);
    }
}

// 读取数据
async function readData() {
    try {
        return await fs.readJson(DATA_FILE);
    } catch (error) {
        console.error('❌ 读取数据失败:', error);
        return null;
    }
}

// 写入数据
async function writeData(data) {
    try {
        data.settings.lastUpdated = new Date().toISOString();
        await fs.writeJson(DATA_FILE, data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('❌ 写入数据失败:', error);
        return false;
    }
}

// API 路由

// 获取所有数据
app.get('/api/data', async (req, res) => {
    const data = await readData();
    if (data) {
        res.json({
            success: true,
            data: data,
            message: '小狗成功获取了小茂密的数据~ 🐾'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '小狗获取数据时遇到了问题 😿'
        });
    }
});

// 日记相关 API
app.get('/api/diary', async (req, res) => {
    const data = await readData();
    if (data) {
        res.json({
            success: true,
            data: data.diary,
            message: '小狗帮小茂密找到了所有日记~ 📖'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '小狗找日记时遇到了问题 😿'
        });
    }
});

app.post('/api/diary', async (req, res) => {
    const data = await readData();
    if (data) {
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleString('zh-CN'),
            mood: req.body.mood || '😸',
            content: req.body.content || '',
            createdAt: new Date().toISOString()
        };
        
        data.diary.unshift(newEntry);
        
        if (await writeData(data)) {
            res.json({
                success: true,
                data: newEntry,
                message: '小狗帮小茂密保存了新日记~ 💖'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '小狗保存日记时遇到了问题 😿'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗保存日记时遇到了问题 😿'
        });
    }
});

app.delete('/api/diary/:id', async (req, res) => {
    const data = await readData();
    if (data) {
        const entryId = parseInt(req.params.id);
        const initialLength = data.diary.length;
        data.diary = data.diary.filter(entry => entry.id !== entryId);
        
        if (data.diary.length < initialLength) {
            if (await writeData(data)) {
                res.json({
                    success: true,
                    message: '小狗帮小茂密删除了日记~ 🗑️'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '小狗删除日记时遇到了问题 😿'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: '小狗没有找到要删除的日记 🤔'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗删除日记时遇到了问题 😿'
        });
    }
});

// 心情追踪 API
app.get('/api/mood', async (req, res) => {
    const data = await readData();
    if (data) {
        res.json({
            success: true,
            data: data.mood,
            message: '小狗帮小茂密找到了所有心情记录~ 💝'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '小狗找心情记录时遇到了问题 😿'
        });
    }
});

app.post('/api/mood', async (req, res) => {
    const data = await readData();
    if (data) {
        const newMood = {
            mood: req.body.mood || '😸',
            text: req.body.text || '',
            timestamp: Date.now(),
            date: new Date().toLocaleString('zh-CN'),
            createdAt: new Date().toISOString()
        };
        
        data.mood.unshift(newMood);
        
        // 只保留最近100条记录
        if (data.mood.length > 100) {
            data.mood = data.mood.slice(0, 100);
        }
        
        if (await writeData(data)) {
            res.json({
                success: true,
                data: newMood,
                message: '小狗帮小茂密记录了新心情~ 💖'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '小狗记录心情时遇到了问题 😿'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗记录心情时遇到了问题 😿'
        });
    }
});

app.delete('/api/mood', async (req, res) => {
    const data = await readData();
    if (data) {
        data.mood = [];
        
        if (await writeData(data)) {
            res.json({
                success: true,
                message: '小狗帮小茂密清空了所有心情记录~ 🗑️'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '小狗清空心情记录时遇到了问题 😿'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗清空心情记录时遇到了问题 😿'
        });
    }
});

// 待办事项 API
app.get('/api/todos', async (req, res) => {
    const data = await readData();
    if (data) {
        res.json({
            success: true,
            data: data.todos,
            message: '小狗帮小茂密找到了所有待办事项~ 📝'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '小狗找待办事项时遇到了问题 😿'
        });
    }
});

app.post('/api/todos', async (req, res) => {
    const data = await readData();
    if (data) {
        const newTodo = {
            id: Date.now(),
            text: req.body.text || '',
            priority: req.body.priority || 'medium',
            completed: false,
            createdAt: new Date().toLocaleString('zh-CN')
        };
        
        data.todos.unshift(newTodo);
        
        if (await writeData(data)) {
            res.json({
                success: true,
                data: newTodo,
                message: '小狗帮小茂密添加了新任务~ 💖'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '小狗添加任务时遇到了问题 😿'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗添加任务时遇到了问题 😿'
        });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    const data = await readData();
    if (data) {
        const todoId = parseInt(req.params.id);
        const todoIndex = data.todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex !== -1) {
            // 更新任务
            if (req.body.hasOwnProperty('completed')) {
                data.todos[todoIndex].completed = req.body.completed;
            }
            if (req.body.hasOwnProperty('text')) {
                data.todos[todoIndex].text = req.body.text;
            }
            if (req.body.hasOwnProperty('priority')) {
                data.todos[todoIndex].priority = req.body.priority;
            }
            
            if (await writeData(data)) {
                res.json({
                    success: true,
                    data: data.todos[todoIndex],
                    message: '小狗帮小茂密更新了任务~ 💖'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '小狗更新任务时遇到了问题 😿'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: '小狗没有找到要更新的任务 🤔'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗更新任务时遇到了问题 😿'
        });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    const data = await readData();
    if (data) {
        const todoId = parseInt(req.params.id);
        const initialLength = data.todos.length;
        data.todos = data.todos.filter(todo => todo.id !== todoId);
        
        if (data.todos.length < initialLength) {
            if (await writeData(data)) {
                res.json({
                    success: true,
                    message: '小狗帮小茂密删除了任务~ 🗑️'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '小狗删除任务时遇到了问题 😿'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: '小狗没有找到要删除的任务 🤔'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗删除任务时遇到了问题 😿'
        });
    }
});

// 清理已完成的待办事项
app.delete('/api/todos/completed/clear', async (req, res) => {
    const data = await readData();
    if (data) {
        const completedCount = data.todos.filter(todo => todo.completed).length;
        data.todos = data.todos.filter(todo => !todo.completed);
        
        if (await writeData(data)) {
            res.json({
                success: true,
                message: `小狗帮小茂密清理了${completedCount}个完成的任务~ ✨`
            });
        } else {
            res.status(500).json({
                success: false,
                message: '小狗清理任务时遇到了问题 😿'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: '小狗清理任务时遇到了问题 😿'
        });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '小狗的服务器运行正常~ 🐕',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '小狗没有找到你要的页面 🤔'
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('❌ 服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '小狗的服务器遇到了问题 😿'
    });
});

// 启动服务器
async function startServer() {
    await ensureDataFile();
    
    app.listen(PORT, () => {
        console.log('🎉 小茂密的专属服务器启动成功!');
        console.log(`🌐 服务器地址: http://localhost:${PORT}`);
        console.log(`📁 数据文件: ${DATA_FILE}`);
        console.log('🐕 小狗正在守护小茂密的数据~');
    });
}

startServer().catch(console.error);
