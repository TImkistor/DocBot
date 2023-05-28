"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Импорт зависимостей
const commands_manager_1 = require("@rus-anonym/commands-manager");
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const API_1 = __importDefault(require("./API"));
const DB_1 = __importDefault(require("./DB"));
const add_1 = __importDefault(require("./commands/add"));
const delete_1 = __importDefault(require("./commands/delete"));
const get_1 = __importDefault(require("./commands/get"));
const list_1 = __importDefault(require("./commands/list"));
// Конфигурация переменных окружения
dotenv_1.default.config();
const config = {
    apiUrl: process.env.API_URL,
    botId: process.env.BOT_ID,
    secretKey: process.env.BOT_SECRET_KEY
};
// Инициализация API, DB и сервера
const api = new API_1.default(config);
const db = new DB_1.default({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});
const server = (0, fastify_1.default)();
// Инициализация команд
const commands = new commands_manager_1.Manager([
    add_1.default,
    delete_1.default,
    get_1.default,
    list_1.default
]);
const onMessage = async (message) => {
    const command = commands.find(message.command.body);
    // Функция для отправки ответов
    const reply = (text, file) => {
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
    }
    else {
        return command.execute(message, reply, db);
    }
};
// Описание endpoint'а для обработки команд
server.post("/command", (request) => {
    void onMessage(request.body);
    return {
        result: "accepted"
    };
});
// Запуск сервера и инициализация API и БД
void (async function main() {
    await api.updateToken();
    await db.connect();
    try {
        await server.listen({
            port: process.env.SERVER_PORT,
            host: process.env.SERVER_HOST
        });
        console.log("Server started");
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();
