// Отключает правила проверки линтера для именования в TypeScript (плагин ESLint)
/* eslint-disable @typescript-eslint/naming-convention */
// Директива declare namespace позволяет объявлять пространства имен (группировки имен) в TypeScript

declare namespace NodeJS {
    export interface ProcessEnv {
        // Определение переменных окружения с соответствующим типом данных
        API_URL: string;
        BOT_ID: string;
        BOT_SECRET_KEY: string;

        SERVER_PORT: number;
        SERVER_HOST: string;

        DB_HOST: string;
        DB_USER: string;
        DB_PASS: string;
        DB_DATABASE: string;

        STORAGE_PATH: string;
    }
}
