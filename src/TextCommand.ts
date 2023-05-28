import { Command, ICommandParams } from "@rus-anonym/commands-manager";
import DB from "./DB";
import { IMessage } from "./types";

// определение типа функции, который используется для обработки сообщения и ответа на него
type TFunc = (message: IMessage, reply: (value: string, file?: {
    file_name: string;
    data: string;
}) => unknown, db: DB) => unknown;

class TextCommand extends Command<TFunc> {
    private _trigger: string | RegExp; // определение приватной переменной для хранения триггера

    constructor(params: ICommandParams<TFunc> & { trigger: string | RegExp }) {
        super(params);
        this._trigger = params.trigger; // установка значения триггера
    }

    /*
    * метод проверки соответствия значения триггера `_trigger`
    * переданному значению `value`
    */
    public check(value: string): boolean {
        if (typeof this._trigger === "string") {
            return this._trigger === value;
        } else {
            return this._trigger.test(value);
        }
    }
}

export default TextCommand;
