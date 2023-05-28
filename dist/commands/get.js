"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const TextCommand_1 = __importDefault(require("../TextCommand")); // класс, который представляет текстовые команды бота
// создается экземпляр команды и передаются аргументы
exports.default = new TextCommand_1.default({
    trigger: /^\/get\s?(\d+)?$/,
    func: async (message, reply, db) => {
        // проверка наличия ID файла в запросе
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const match = message.command.body.match(/^\/get\s?(\d+)?$/);
        if (match[1] === undefined) {
            return reply("Выберите ID файла");
        }
        // обращение к базе данных для получения информации о файле
        const file = await db.getFile(Number(match[1]));
        if (file === null) {
            return reply("Файл не найден");
        }
        // чтение содержимого файла
        const buffer = await (0, promises_1.readFile)(file.path);
        let mimeType = "text/plain";
        if (file.file_name.endsWith(".pdf")) {
            mimeType = "application/pdf"; // если файл pdf
        }
        if (file.file_name.endsWith(".docx")) {
            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // если файл docx
        }
        // добавление в лог информации об пользователе, вызвавшем команду
        void db.addLog({
            user_id: message.from.user_huid,
            command: "get",
            file_id: file.ID
        });
        // возвращение содержимого файла, закодированного в base64
        return reply(`Ваш файл #${file.ID}`, {
            file_name: file.file_name,
            data: `data:${mimeType};base64,${buffer.toString("base64")}`
        });
    }
});
