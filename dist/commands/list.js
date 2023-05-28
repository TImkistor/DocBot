"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Импортируем модуль TextCommand из "../TextCommand"
const TextCommand_1 = __importDefault(require("../TextCommand"));
// Экспортируем новую текстовую команду
exports.default = new TextCommand_1.default({
    // Устанавливаем триггер для команды
    trigger: "/list",
    // Устанавливаем функцию обработчик для команды
    func: async (message, reply, db) => {
        // Получаем список файлов из БД
        const files = await db.getFiles();
        // Добавляем запись о выполнении команды в лог
        void db.addLog({
            user_id: message.from.user_huid,
            command: "list"
        });
        // Возвращаем результат выполнения команды
        return reply(
        // Формируем список файлов в виде строки
        files.map(({ ID: id, file_name }, index) => `${id}. ${file_name}`).join("\n"));
    }
});
