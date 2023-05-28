// Ну вот ща начинаем гнать код типа на TypeScript

import TextCommand from "../TextCommand";

// И так, ебашим новую команду на текст
export default new TextCommand({
    // Строку-триггер ставим в поле trigger
    trigger: "/add",
    // Ну тут сам логический код команды, на TypeScript конечно, ман
    func: async (message, reply, db): Promise<unknown> => { // Проверяем есть ли прикреплённый файл к сообщению if (message.attachments.length === 0) { return reply("Не прикреплён документ"); }
    // Получаем прикреплённый файл и имя файла
        const [document] = message.attachments;
        const fileName = document.data.file_name;

        // Проверяем, что прикреплен именно документ
        if (document.type !== "document") {
            return reply("Не прикреплён документ");
        }

        // Проверяем, что файл имеет расширение pdf или docx
        if (!(fileName.endsWith("pdf")) && !(fileName.endsWith("docx"))) {
            return reply("Данный формат не принимается");
        }

        // Добавляем запись в базу данных о сохранении файла
        void db.addLog({
            user_id: message.from.user_huid,
            command: "add",
            file_id: await db.insertFile(document.data.content, document.data.file_name)
        });

        // Возвращаем строку с результатом сохранения файла
        return reply("Файл сохранён");
    }
});
