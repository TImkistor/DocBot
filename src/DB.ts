// Импортируем необходимые модули
import { Connection, createConnection } from "mysql2";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Интерфейс для описания файлов
interface IFile {
    ID: number;
    file_name: string;
    path: string;
}

class DB {
    // Приватные свойства
    private readonly _connection: Connection;
    private readonly _storage: string;

    // Конструктор класса
    constructor({
        host,
        user,
        password,
        database
    }: {
        host: string;
        user: string;
        password: string;
        database: string;
    }) {
        this._connection = createConnection({
            host,
            user,
            password,
            database
        });
        this._storage = process.env.STORAGE_PATH;
    }

    // Проверка доступа пользователя
    public async hasAccess(huid: string): Promise<boolean> {
        const [rows] = await this._connection.promise().query(
            "SELECT * FROM users WHERE users.ID = ? LIMIT 1", [huid]
        );

        return (rows as []).length !== 0;
    }

    // Вставка файла
    public async insertFile(content: string, filename: string): Promise<number> {
        const [response] = await this._connection.promise().execute(
            "SELECT LAST_INSERT_ID() AS LAST_ID;"
        );

        const lastId = ((response as { LAST_ID: number }[])[0]).LAST_ID;

        const backupPath = path.resolve(this._storage, `${lastId + 1}.bak`);

        await writeFile(backupPath, content);

        await this._connection.promise().execute(
            "INSERT INTO files (ID, file_name) VALUES (?, ?);",
            [lastId + 1, filename]
        );

        return lastId + 1;
    }

    // Удаление файла
    public async deleteFile(id: number): Promise<true> {
        const filePath = path.resolve(this._storage, `${id}.bak`);

        await unlink(filePath);

        await this._connection.promise().query(
            "DELETE FROM files WHERE ID = ?", [id]
        );

        return true;
    }

    // Получение файла
    public async getFile(id: number): Promise<IFile | null> {
        const [rows] = await this._connection.promise().query(
            "SELECT * FROM files WHERE ID = ?", [id]
        );

        if (!(Array.isArray(rows)) || rows.length === 0) {
            return null;
        }

        const file: IFile = (rows as IFile[])[0];

        return {
            ...file,
            path: path.resolve(this._storage, `${file.ID}.bak`)
        };
    }

    // Получение всех файлов
    public async getFiles(): Promise<IFile[]> {
        const [rows] = await this._connection.promise().query(
            "SELECT * FROM files"
        );

        return (rows as IFile[]).map((file) => {
            return {
                ...file,
                path: path.resolve(this._storage, `${file.ID}.bak`)
            };
        });
    }

    // Добавление лога
    public addLog({ command, file_id, user_id }: {
        user_id: string;
        command: string;
        file_id?: number;
    }): Promise<unknown> {
        return this._connection.promise().query(
            `INSERT INTO logs (command, user_id, date${file_id !== undefined ? ", file_id" : ""}) VALUES (?, ?, ?${file_id !== undefined ? ", ?" : ""});`,
            [command, user_id, new Date(), file_id]
        );
    }

    // Установление соединения
    public connect(): Promise<void> {
        return this._connection.promise().connect();
    }
}

export default DB;
