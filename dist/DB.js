"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Импортируем необходимые модули
const mysql2_1 = require("mysql2");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
class DB {
    // Приватные свойства
    _connection;
    _storage;
    // Конструктор класса
    constructor({ host, user, password, database }) {
        this._connection = (0, mysql2_1.createConnection)({
            host,
            user,
            password,
            database
        });
        this._storage = process.env.STORAGE_PATH;
    }
    // Проверка доступа пользователя
    async hasAccess(huid) {
        const [rows] = await this._connection.promise().query("SELECT * FROM users WHERE users.ID = ? LIMIT 1", [huid]);
        return rows.length !== 0;
    }
    // Вставка файла
    async insertFile(content, filename) {
        const [response] = await this._connection.promise().execute("SELECT LAST_INSERT_ID() AS LAST_ID;");
        const lastId = (response[0]).LAST_ID;
        const backupPath = node_path_1.default.resolve(this._storage, `${lastId + 1}.bak`);
        await (0, promises_1.writeFile)(backupPath, content);
        await this._connection.promise().execute("INSERT INTO files (ID, file_name) VALUES (?, ?);", [lastId + 1, filename]);
        return lastId + 1;
    }
    // Удаление файла
    async deleteFile(id) {
        const filePath = node_path_1.default.resolve(this._storage, `${id}.bak`);
        await (0, promises_1.unlink)(filePath);
        await this._connection.promise().query("DELETE FROM files WHERE ID = ?", [id]);
        return true;
    }
    // Получение файла
    async getFile(id) {
        const [rows] = await this._connection.promise().query("SELECT * FROM files WHERE ID = ?", [id]);
        if (!(Array.isArray(rows)) || rows.length === 0) {
            return null;
        }
        const file = rows[0];
        return {
            ...file,
            path: node_path_1.default.resolve(this._storage, `${file.ID}.bak`)
        };
    }
    // Получение всех файлов
    async getFiles() {
        const [rows] = await this._connection.promise().query("SELECT * FROM files");
        return rows.map((file) => {
            return {
                ...file,
                path: node_path_1.default.resolve(this._storage, `${file.ID}.bak`)
            };
        });
    }
    // Добавление лога
    addLog({ command, file_id, user_id }) {
        return this._connection.promise().query(`INSERT INTO logs (command, user_id, date${file_id !== undefined ? ", file_id" : ""}) VALUES (?, ?, ?${file_id !== undefined ? ", ?" : ""});`, [command, user_id, new Date(), file_id]);
    }
    // Установление соединения
    connect() {
        return this._connection.promise().connect();
    }
}
exports.default = DB;
