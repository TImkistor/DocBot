import { readFile } from "fs/promises";
import TextCommand from "../TextCommand"; // класс, который представляет текстовые команды бота

// создается экземпляр команды и передаются аргументы
export default new TextCommand({
    trigger: /^\/get\s?(\d+)?$/, // регулярное выражение для определения, вызвана ли эта команда
    func: async (message, reply, db): Promise<unknown> => {

        // проверка наличия ID файла в запросе
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const match = message.command.body.match(/^\/get\s?(\d+)?$/)!;
        if (match[1] === undefined) {
            return reply("Выберите ID файла");
        }

        // обращение к базе данных для получения информации о файле
        const file = await db.getFile(Number(match[1]));
        if (file === null) {
            return reply("Файл не найден");
        }

        // чтение содержимого файла
        const buffer = await readFile(file.path);

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
