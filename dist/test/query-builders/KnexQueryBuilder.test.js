"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const util_1 = require("../util");
// import { KnexProvider } from '../../lib/facades/global/KnexProviderFacade'
describe('KnexQueryBuilder', function () {
    beforeAll(async function () {
        return util_1.init_knex('najs_eloquent_knex_query_builder').then(function () {
            return util_1.knex_run_sql(`CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        created_at DATETIME,
        updated_at DATETIME,
        deleted_at DATETIME,
        age INT,
        PRIMARY KEY (id)
      )`);
        });
    });
    it('should work', function () { });
});
