"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const Seeder_1 = require("../../lib/seed/Seeder");
describe('Seeder', function () {
    class UserSeeder extends Seeder_1.Seeder {
        getClassName() {
            return 'UserSeeder';
        }
        run() { }
    }
    najs_binding_1.register(UserSeeder);
    class PostSeeder extends Seeder_1.Seeder {
        getClassName() {
            return 'PostSeeder';
        }
        run() {
            this.call('UserSeeder', 'NotFound');
        }
    }
    najs_binding_1.register(PostSeeder);
    class NotFound {
        run() { }
    }
    NotFound.className = 'NotFound';
    najs_binding_1.register(NotFound);
    describe('.setCommand()', function () {
        it('simply assigns to "command"', function () {
            const command = {};
            const seeder = new UserSeeder();
            expect(seeder['command']).toBeUndefined();
            seeder.setCommand(command);
            expect(seeder['command'] === command).toBe(true);
        });
    });
    describe('protected .getOutput()', function () {
        it('returns console if there is no "command"', function () {
            const seeder = new UserSeeder();
            expect(seeder['getOutput']() === console).toBe(true);
        });
        it('returns "command".getOutput() if command is assigned', function () {
            const output = {};
            const command = {
                getOutput() {
                    return output;
                }
            };
            const seeder = new UserSeeder();
            seeder.setCommand(command);
            expect(seeder['getOutput']() === output).toBe(true);
        });
    });
    describe('.invoke()', function () {
        it('use .getOutput() to log the log message with info level, then calls .run()', function () {
            const output = {
                info() { }
            };
            const seeder = new UserSeeder();
            const getOutputStub = Sinon.stub(seeder, 'getOutput');
            getOutputStub.returns(output);
            const runSpy = Sinon.spy(seeder, 'run');
            const infoSpy = Sinon.spy(output, 'info');
            seeder.invoke();
            expect(getOutputStub.called).toBe(true);
            expect(runSpy.called).toBe(true);
            expect(infoSpy.calledWith('<info>Seeding:</info> UserSeeder')).toBe(true);
        });
    });
    describe('.call()', function () {
        it('flatten arguments and create instance, if the instance is Seeder it call invoke, otherwise it does nothing', function () {
            const postSeeder = new PostSeeder();
            const output = {
                info() { }
            };
            const getOutputStub = Sinon.stub(postSeeder, 'getOutput');
            getOutputStub.returns(output);
            const userGetOutputStub = Sinon.stub(UserSeeder.prototype, 'getOutput');
            userGetOutputStub.returns(output);
            const userSeederRunSpy = Sinon.spy(UserSeeder.prototype, 'run');
            const notFoundRunSpy = Sinon.spy(NotFound.prototype, 'run');
            postSeeder.run();
            expect(userSeederRunSpy.called).toBe(true);
            expect(notFoundRunSpy.called).toBe(false);
        });
    });
});
