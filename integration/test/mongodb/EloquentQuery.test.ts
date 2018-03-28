import { QueryLog } from '../../../dist/lib/v1'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent functions', function() {
  beforeAll(async function() {
    await init_mongoose('integration_eloquent_query')
  })

  afterAll(async function() {
    await delete_collection(['users'])
  })

  const userModel = new User()

  describe('.queryName()', function() {
    it('starts new query with given name.', async function() {
      const query = userModel.queryName('You can name the query what ever you want')
      expect(query['name']).toEqual('You can name the query what ever you want')

      QueryLog.enable()
      await query.where('email', 'test').get()
      const log = QueryLog.pull()
      expect(log[0].query['name']).toEqual('You can name the query what ever you want')
      QueryLog.disable()
    })
  })

  describe('.select()', function() {
    it('set the columns or fields to be selected.', async function() {
      // await factory(User)
      //   .times(2)
      //   .create()
      // const emails = await userModel.select('email', 'password').get()
      // for (const email of emails) {
      //   console.log(email.toObject())
      // }
    })
  })
})
