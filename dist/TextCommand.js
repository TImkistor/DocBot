"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_manager_1 = require("@rus-anonym/commands-manager");
class TextCommand extends commands_manager_1.Command {
    _trigger; // определение приватной переменной для хранения триггера
    constructor(params) {
        super(params);
        this._trigger = params.trigger; // установка значения триггера
    }
    /*
    * метод проверки соответствия значения триггера `_trigger`
    * переданному значению `value`
    */
    check(value) {
        if (typeof this._trigger === "string") {
            return this._trigger === value;
        }
        else {
            return this._trigger.test(value);
        }
    }
}
exports.default = TextCommand;
