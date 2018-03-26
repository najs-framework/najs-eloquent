"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
class Seeder {
    setCommand(command) {
        this.command = command;
        return this;
    }
    call() {
        lodash_1.flatten(arguments).forEach(function (className) {
            const instance = najs_binding_1.make(className);
            if (instance instanceof Seeder) {
                instance.invoke();
            }
        });
        return this;
    }
    getOutput() {
        if (this.command) {
            return this.command.getOutput();
        }
        return console;
    }
    invoke() {
        this.getOutput().info('<info>Seeding:</info> ' + this.getClassName());
        this.run();
    }
}
exports.Seeder = Seeder;
