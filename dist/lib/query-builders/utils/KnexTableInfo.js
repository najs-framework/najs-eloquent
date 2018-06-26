"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KnexProviderFacade_1 = require("../../facades/global/KnexProviderFacade");
class KnexTableInfo {
    constructor(table, database) {
        this.table = table;
        this.database = database || KnexProviderFacade_1.KnexProvider.getDefaultConfig().connection['database'];
    }
    getPrimaryKeyName() {
        return '';
    }
    hasPrimaryKey() {
        return false;
    }
    getColumns() {
        return {};
    }
    getTableInfo() {
        return new Promise(resolve => {
            KnexProviderFacade_1.KnexProvider.createQueryBuilder('information_schema.columns')
                .where('table_name', this.table)
                .where('table_schema', this.database)
                .then(result => {
                resolve(this);
            });
        });
    }
}
exports.KnexTableInfo = KnexTableInfo;
