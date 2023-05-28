// Импортируем модуль TextCommand из "../TextCommand"
import TextCommand from "../TextCommand";

// Экспортируем новую текстовую команду
export default new TextCommand({
    // Устанавливаем триггер для команды
    trigger: "/list",

    // Устанавливаем функцию обработчик для команды
    func: async (message, reply, db): Promise<unknown> => {

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
            files.map(({ ID: id, file_name }, index) => `${id}. ${file_name}`).join("\n")
        );
    }
});
