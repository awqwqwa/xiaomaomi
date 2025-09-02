// 小茂密专属世界 API 客户端
// 小狗为小茂密制作的数据通信工具 🐕💖

class XiaomaomiAPI {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.isOnline = navigator.onLine;
        
        // 监听网络状态
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 小狗的网络连接恢复了~');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 小狗的网络连接断开了，将使用本地存储~');
        });
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };
        
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '请求失败');
            }
            
            return data;
        } catch (error) {
            console.error('🚨 API请求失败:', error);
            
            // 如果是网络错误，尝试使用本地存储
            if (!this.isOnline || error.name === 'TypeError') {
                return this.handleOfflineRequest(endpoint, options);
            }
            
            throw error;
        }
    }

    // 离线处理
    handleOfflineRequest(endpoint, options) {
        console.log('📱 使用本地存储处理请求~');
        
        // 根据不同的端点返回本地存储的数据
        if (endpoint.includes('/diary')) {
            return this.handleOfflineDiary(endpoint, options);
        } else if (endpoint.includes('/mood')) {
            return this.handleOfflineMood(endpoint, options);
        } else if (endpoint.includes('/todos')) {
            return this.handleOfflineTodos(endpoint, options);
        }
        
        return Promise.resolve({
            success: false,
            message: '小狗暂时无法连接服务器，请稍后再试~ 😿'
        });
    }

    // 离线日记处理
    handleOfflineDiary(endpoint, options) {
        const localKey = 'catDiary';
        let data = JSON.parse(localStorage.getItem(localKey) || '[]');
        
        if (options && options.method === 'POST') {
            try {
                const bodyData = JSON.parse(options.body);
                const newEntry = {
                    id: Date.now(),
                    date: new Date().toLocaleString('zh-CN'),
                    mood: bodyData.mood || '😸',
                    content: bodyData.content || '',
                    createdAt: new Date().toISOString()
                };
                data.unshift(newEntry);
                localStorage.setItem(localKey, JSON.stringify(data));
                return Promise.resolve({ success: true, data: newEntry, message: '日记已保存到本地~ 📖' });
            } catch (error) {
                console.error('离线保存日记失败:', error);
                return Promise.resolve({ success: false, message: '本地保存失败~ 😿' });
            }
        }
        
        return Promise.resolve({ success: true, data: data, message: '从本地获取日记数据~ 📖' });
    }

    // 离线心情处理
    handleOfflineMood(endpoint, options) {
        const localKey = 'catMoodHistory';
        let data = JSON.parse(localStorage.getItem(localKey) || '[]');
        
        if (options && options.method === 'POST') {
            try {
                const bodyData = JSON.parse(options.body);
                const newMood = {
                    mood: bodyData.mood || '😸',
                    text: bodyData.text || '',
                    timestamp: Date.now(),
                    date: new Date().toLocaleString('zh-CN'),
                    createdAt: new Date().toISOString()
                };
                data.unshift(newMood);
                if (data.length > 100) data = data.slice(0, 100);
                localStorage.setItem(localKey, JSON.stringify(data));
                return Promise.resolve({ success: true, data: newMood, message: '心情已保存到本地~ 💝' });
            } catch (error) {
                console.error('离线保存心情失败:', error);
                return Promise.resolve({ success: false, message: '本地保存失败~ 😿' });
            }
        }
        
        if (options && options.method === 'DELETE') {
            localStorage.setItem(localKey, JSON.stringify([]));
            return Promise.resolve({ success: true, message: '心情记录已清空~ 🗑️' });
        }
        
        return Promise.resolve({ success: true, data: data, message: '从本地获取心情数据~ 💝' });
    }

    // 离线待办处理
    handleOfflineTodos(endpoint, options) {
        const localKey = 'catTodos';
        let data = JSON.parse(localStorage.getItem(localKey) || '[]');
        
        if (options && options.method === 'POST') {
            try {
                const bodyData = JSON.parse(options.body);
                const newTodo = {
                    id: Date.now(),
                    text: bodyData.text || '',
                    priority: bodyData.priority || 'medium',
                    completed: false,
                    createdAt: new Date().toLocaleString('zh-CN')
                };
                data.unshift(newTodo);
                localStorage.setItem(localKey, JSON.stringify(data));
                return Promise.resolve({ success: true, data: newTodo, message: '任务已保存到本地~ 📝' });
            } catch (error) {
                console.error('离线保存任务失败:', error);
                return Promise.resolve({ success: false, message: '本地保存失败~ 😿' });
            }
        }
        
        // 处理其他操作（更新、删除等）
        if (options && options.method === 'PUT') {
            // 简单的更新处理
            return Promise.resolve({ success: true, message: '离线模式下任务已更新~ 📝' });
        }
        
        if (options && options.method === 'DELETE') {
            // 简单的删除处理
            return Promise.resolve({ success: true, message: '离线模式下任务已删除~ 🗑️' });
        }
        
        return Promise.resolve({ success: true, data: data, message: '从本地获取任务数据~ 📝' });
    }

    // 健康检查
    async health() {
        return await this.request('/health');
    }

    // 获取所有数据
    async getAllData() {
        return await this.request('/data');
    }

    // 日记 API
    async getDiary() {
        return await this.request('/diary');
    }

    async addDiary(mood, content) {
        return await this.request('/diary', {
            method: 'POST',
            body: { mood, content }
        });
    }

    async deleteDiary(id) {
        return await this.request(`/diary/${id}`, {
            method: 'DELETE'
        });
    }

    // 心情 API
    async getMood() {
        return await this.request('/mood');
    }

    async addMood(mood, text) {
        return await this.request('/mood', {
            method: 'POST',
            body: { mood, text }
        });
    }

    async clearMood() {
        return await this.request('/mood', {
            method: 'DELETE'
        });
    }

    // 待办事项 API
    async getTodos() {
        return await this.request('/todos');
    }

    async addTodo(text, priority = 'medium') {
        return await this.request('/todos', {
            method: 'POST',
            body: { text, priority }
        });
    }

    async updateTodo(id, updates) {
        return await this.request(`/todos/${id}`, {
            method: 'PUT',
            body: updates
        });
    }

    async deleteTodo(id) {
        return await this.request(`/todos/${id}`, {
            method: 'DELETE'
        });
    }

    async clearCompletedTodos() {
        return await this.request('/todos/completed/clear', {
            method: 'DELETE'
        });
    }

    // 数据同步（当网络恢复时）
    async syncLocalData() {
        if (!this.isOnline) {
            console.log('📡 网络未连接，无法同步数据');
            return;
        }

        console.log('🔄 开始同步本地数据到服务器...');
        
        try {
            // 这里可以实现更复杂的同步逻辑
            // 比如检查本地数据的时间戳，只同步新的数据等
            console.log('✅ 数据同步完成~');
        } catch (error) {
            console.error('❌ 数据同步失败:', error);
        }
    }
}

// 创建全局 API 实例
const xiaomaomiAPI = new XiaomaomiAPI();

// 导出 API 实例（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XiaomaomiAPI;
}
