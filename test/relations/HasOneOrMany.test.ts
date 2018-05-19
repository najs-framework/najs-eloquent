import 'jest'
import { Relation } from '../../lib/relations/Relation'
import { HasOneOrMany } from '../../lib/relations/HasOneOrMany'

describe('HasOneOrMany', function() {
  it('extends Relation, implements IAutoload with class name NajsEloquent.Relation.HasOneOrMany', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    expect(relation).toBeInstanceOf(Relation)
    expect(relation.getClassName()).toEqual('NajsEloquent.Relation.HasOneOrMany')
  })

  describe('.setup()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.setup(true, <any>{}, <any>{})
  })

  describe('.buildData()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.buildData()
  })

  describe('.lazyLoad()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.lazyLoad()
  })

  describe('.eagerLoad()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.eagerLoad()
  })
})
