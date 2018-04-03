import 'jest'
import { User } from '../../models/User'
// import { Comment } from '../../models/Comment'

function noop(param: any) {}

describe('Syntax Test - 1st way definition', function() {
  // const userModel = new User()
  // const commentModel = new Comment()

  describe('Model members', function() {
    it('should work with sub-class', function() {
      class Admin extends User {
        getEloquentMember() {
          noop(this.id)
          this.getId()
        }

        setEloquentMember() {
          this.id = 'test'
          this.setId('test')
        }

        getModelMember() {
          noop(this.first_name)
          noop(this.getHashedPassword())
        }

        setModelProperty() {
          this.first_name = 'test'
          this.setRawPassword('test')
        }
      }

      noop(Admin)
    })
  })

  describe('Model querying', function() {
    it('should work with .first()', async function() {
      // const result = await userModel.first()
      // noop(result.first_name)
      // result.first_name = 'test'
      // commentModel.first()
    })
  })
})
