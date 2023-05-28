import { Command, ICommandParams } from "@rus-anonym/commands-manager";
import DB from "./DB";
import { IMessage } from "./types";
type TFunc = (message: IMessage, reply: (value: string, file?: {
    file_name: string;
    data: string;
}) => unknown, db: DB) => unknown;
declare class TextCommand extends Command<TFunc> {
    private _trigger;
    constructor(params: ICommandParams<TFunc> & {
        trigger: string | RegExp;
    });
    check(value: string): boolean;
}
export default TextCommand;
