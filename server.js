const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
const port = 3300; // Use the default port for MariaDB

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'edasa001',
    password: 'hello',
    database: 'todoappcourse',
    connectionLimit: 5 // Adjust as needed
});

app.use(bodyParser.json());

class DatabaseHandler {
    constructor(pool) {
        this.pool = pool;
    }

    async addTask(task) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const result = await conn.query("SELECT COALESCE(MAX(task_id), 0) FROM todo");
            const maxId = parseInt(result[0]['COALESCE(MAX(task_id), 0)'], 10);
            const newTaskId = maxId + 1;
            await conn.query("INSERT INTO todo (task, completed) VALUES (?, ?)", [task, false]);
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async getTasks() {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const rows = await conn.query("SELECT * FROM todo ORDER BY task_id DESC");
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async updateTask(taskId) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            await conn.query("UPDATE todo SET completed = true WHERE task_id = ?", [taskId]);
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }

    async deleteTask(taskId) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            await conn.query("DELETE FROM todo WHERE task_id = ?", [taskId]);
        } catch (error) {
            throw error;
        } finally {
            if (conn) conn.end();
        }
    }
}

const databaseHandler = new DatabaseHandler(pool);

app.post('/addTask', async (req, res) => {
    const { task } = req.body;
    try {
        await databaseHandler.addTask(task);
        res.json({ message: 'Task added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/viewTasks', async (req, res) => {
    try {
        const tasks = await databaseHandler.getTasks();
        res.json({ tasks });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/updateTask/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await databaseHandler.updateTask(taskId);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/deleteTask/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await databaseHandler.deleteTask(taskId);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
