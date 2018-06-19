"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_facade_1 = require("najs-facade");
const KnexProvider_1 = require("../../lib/providers/KnexProvider");
describe('KnexProvider', function () {
    it('extends Facade and implements Autoload under name "NajsEloquent.Provider.KnexProvider"', function () {
        const knexProvider = new KnexProvider_1.KnexProvider();
        expect(knexProvider).toBeInstanceOf(najs_facade_1.Facade);
        expect(knexProvider.getClassName()).toEqual('NajsEloquent.Provider.KnexProvider');
    });
    describe('.setDefaultConfig()', function () {
        it('simply assigns to this.defaultConfig', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            expect(knexProvider.getDefaultConfig()).toBeUndefined();
            const config = {};
            knexProvider.setDefaultConfig(config);
            expect(knexProvider.getDefaultConfig() === config).toBe(true);
        });
        it('clears this.defaultKnex instance', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            const config = {};
            knexProvider.setDefaultConfig(config);
        });
    });
    describe('.getDefaultConfig()', function () {
        it('simply returns to this.defaultConfig', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            expect(knexProvider.getDefaultConfig()).toBeUndefined();
            const config = {};
            knexProvider.setDefaultConfig(config);
            expect(knexProvider.getDefaultConfig() === config).toBe(true);
        });
    });
    describe('.create()', function () {
        it('calls knex() with this.defaultConfig if the config param is not passed', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            const config = { client: 'mysql' };
            knexProvider.setDefaultConfig(config);
            const result = knexProvider.create();
            expect(result['client']['config'] === config).toBe(true);
        });
        it('calls knex() with passed config, this case always create new knex instance', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            const defaultConfig = { client: 'mysql' };
            knexProvider.setDefaultConfig(defaultConfig);
            const config = { client: 'mysql' };
            const result = knexProvider.create(config);
            expect(result['client']['config'] === config).toBe(true);
        });
    });
    describe('.createQueryBuilder()', function () {
        it('calls .create() with default config, then passes table to the result function', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            const config = { client: 'mysql' };
            knexProvider.setDefaultConfig(config);
            const result = knexProvider.createQueryBuilder('table');
            expect(result['client']['config'] === config).toBe(true);
            expect(result.toQuery()).toEqual('select * from `table`');
        });
        it('calls .create() with passed config, then passes table to the result function', function () {
            const knexProvider = new KnexProvider_1.KnexProvider();
            const defaultConfig = { client: 'mysql' };
            knexProvider.setDefaultConfig(defaultConfig);
            const config = { client: 'mysql' };
            const result = knexProvider.createQueryBuilder('table', config);
            expect(result['client']['config'] === config).toBe(true);
            expect(result.toQuery()).toEqual('select * from `table`');
        });
    });
});
