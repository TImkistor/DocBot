interface IFile {
    ID: number;
    file_name: string;
    path: string;
}
declare class DB {
    private readonly _connection;
    private readonly _storage;
    constructor({ host, user, password, database }: {
        host: string;
        user: string;
        password: string;
        database: string;
    });
    hasAccess(huid: string): Promise<boolean>;
    insertFile(content: string, filename: string): Promise<number>;
    deleteFile(id: number): Promise<true>;
    getFile(id: number): Promise<IFile | null>;
    getFiles(): Promise<IFile[]>;
    addLog({ command, file_id, user_id }: {
        user_id: string;
        command: string;
        file_id?: number;
    }): Promise<unknown>;
    connect(): Promise<void>;
}
export default DB;
