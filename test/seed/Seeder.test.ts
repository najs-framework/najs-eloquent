import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { Seeder } from '../../lib/seed/Seeder'

describe('Seeder', function() {
  class UserSeeder extends Seeder {
    getClassName() {
      return 'UserSeeder'
    }

    run() {}
  }
  register(UserSeeder)

  class PostSeeder extends Seeder {
    getClassName() {
      return 'PostSeeder'
    }

    run() {
      this.call('UserSeeder', 'NotFound')
    }
  }
  register(PostSeeder)

  class NotFound {
    static className = 'NotFound'

    run() {}
  }
  register(NotFound)

  describe('.setCommand()', function() {
    it('simply assigns to "command"', function() {
      const command = {}
      const seeder = new UserSeeder()
      expect(seeder['command']).toBeUndefined()
      seeder.setCommand(command)
      expect(seeder['command'] === command).toBe(true)
    })
  })

  describe('protected .getOutput()', function() {
    it('returns console if there is no "command"', function() {
      const seeder = new UserSeeder()
      expect(seeder['getOutput']() === console).toBe(true)
    })

    it('returns "command".getOutput() if command is assigned', function() {
      const output = {}
      const command = {
        getOutput() {
          return output
        }
      }
      const seeder = new UserSeeder()
      seeder.setCommand(command)
      expect(seeder['getOutput']() === output).toBe(true)
    })
  })

  describe('.invoke()', function() {
    it('use .getOutput() to log the log message with info level, then calls .run()', function() {
      const output = {
        info() {}
      }
      const seeder = new UserSeeder()

      const getOutputStub = Sinon.stub(seeder, <any>'getOutput')
      getOutputStub.returns(output)

      const runSpy = Sinon.spy(seeder, 'run')
      const infoSpy = Sinon.spy(output, 'info')

      seeder.invoke()

      expect(getOutputStub.called).toBe(true)
      expect(runSpy.called).toBe(true)
      expect(infoSpy.calledWith('<info>Seeding:</info> UserSeeder')).toBe(true)
    })
  })

  describe('.call()', function() {
    it('flatten arguments and create instance, if the instance is Seeder it call invoke, otherwise it does nothing', function() {
      const postSeeder = new PostSeeder()

      const output = {
        info() {}
      }
      const getOutputStub = Sinon.stub(postSeeder, <any>'getOutput')
      getOutputStub.returns(output)

      const userGetOutputStub = Sinon.stub(UserSeeder.prototype, <any>'getOutput')
      userGetOutputStub.returns(output)

      const userSeederRunSpy = Sinon.spy(UserSeeder.prototype, 'run')
      const notFoundRunSpy = Sinon.spy(NotFound.prototype, 'run')

      postSeeder.run()
      expect(userSeederRunSpy.called).toBe(true)
      expect(notFoundRunSpy.called).toBe(false)
    })
  })
})
