// Импорт зависимостей
import { Manager } from "@rus-anonym/commands-manager";
import dotenv from "dotenv";
import Fastify from "fastify";
import API from "./API";
import DB from "./DB";
import TextCommand from "./TextCommand";
import addCommand from "./commands/add";
import deleteCommand from "./commands/delete";
import getCommand from "./commands/get";
import listCommand from "./commands/list";
import { IMessage } from "./types";

// Конфигурация переменных окружения
dotenv.config();

const config = {
    apiUrl: process.env.API_URL,
    botId: process.env.BOT_ID,
    secretKey: process.env.BOT_SECRET_KEY
};

// Инициализация API, DB и сервера
const api = new API(config);
const db = new DB({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});
const server = Fastify();

// Инициализация команд
const commands = new Manager<TextCommand>([
    addCommand,
    deleteCommand,
    getCommand,
    listCommand
]);

const onMessage = async (message: IMessage): Promise<unknown> => {
    const command = commands.find(message.command.body);

    // Функция для отправки ответов
    const reply = (text: string, file?: {
        file_name: string;
        data: string;
    }): Promise<unknown> => {
        return api.call("POST", "/api/v3/botx/events/reply_event", {
            source_sync_id: message.sync_id,
            reply: {
                status: "ok",
                body: text
            },
            file
        });
    };

    // Проверка доступности пользователя
    if (!(await db.hasAccess(message.from.user_huid))) {
        return reply("У вас нет доступа");
    }

    // Обработка команды
    if (!command) {
        return reply("Такой команды не найдено!");
    } else {
        return command.execute(message, reply, db);
    }
};

// Описание endpoint'а для обработки команд
server.post<{
    Body: IMessage;
}>("/command", (request) => {
    void onMessage(request.body);

    return {
        result: "accepted"
    };
});

// Запуск сервера и инициализация API и БД
void (async function main(): Promise<void> {
    await api.updateToken();
    await db.connect();

    try {
        await server.listen({
            port: process.env.SERVER_PORT,
            host: process.env.SERVER_HOST
        });
        console.log("Server started");
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
