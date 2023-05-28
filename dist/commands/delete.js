"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Импортируем тип команды
const TextCommand_1 = __importDefault(require("../TextCommand"));
// Экспортируем чёткую новую текстовую команду
exports.default = new TextCommand_1.default({
    // Триггер для удаления файлов
    trigger: /^\/delete\s?(\d+)?$/,
    // Собираем функцию для удаления файлов (должна быть асинхронной)
    func: async (message, reply, db) => {
        // Если нет совпадений, то надо вернуть сообщение для пользователя
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const match = message.command.body.match(/^\/delete\s?(\d+)?$/);
        if (match[1] === undefined) {
            return reply("Выберите ID файла");
        }
        // Выбираем файл и проверяем, существует ли он в базе данных
        const file = await db.getFile(Number(match[1]));
        // Если файла нет, то опять же сообщаем о ошибке
        if (file === null) {
            return reply("Файл не найден");
        }
        // Удаляем файл из базы данных
        await db.deleteFile(file.ID);
        // Добавляем запись в логи базы данных
        void db.addLog({
            user_id: message.from.user_huid,
            command: "delete",
            file_id: file.ID
        });
        // Сообщаем пользователю, что файл удалён
        return reply("Файл удалён");
    }
});
