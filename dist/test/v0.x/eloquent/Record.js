"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Record {
    constructor(data) {
        this.data = data;
    }
    static create(data) {
        const record = new Record(data);
        const proxy = new Proxy(record, {
            get: function (target, key) {
                if (key !== 'data') {
                    return target.data[key];
                }
                return target[key];
            },
            set: function (target, key, value) {
                if (key !== 'data') {
                    target.data[key] = value;
                }
                else {
                    target[key] = value;
                }
                return true;
            }
        });
        return proxy;
    }
}
exports.Record = Record;
