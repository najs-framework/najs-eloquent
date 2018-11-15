import 'jest'
import { Model } from '../../../lib/index'

describe('Model Serialization Feature', function() {
  describe('No Setting', function() {
    class ModelNoSetting extends Model {
      protected fillable = ['a', 'b', 'c', 'd']

      getClassName() {
        return 'ModelNoSetting'
      }
    }
    Model.register(ModelNoSetting)

    function makeModel() {
      return new ModelNoSetting({ a: 1, b: 2, c: 3, d: 4 })
    }

    it('should work as expected', function() {
      expect(makeModel().toObject()).toEqual({ a: 1, b: 2, c: 3, d: 4 })

      expect(
        makeModel()
          .addVisible('a')
          .addVisible('b')
          .toObject()
      ).toEqual({ a: 1, b: 2 })

      expect(
        makeModel()
          .setVisible(['a', 'b'])
          .toObject()
      ).toEqual({ a: 1, b: 2 })

      expect(
        makeModel()
          .addHidden('a')
          .addHidden('b')
          .toObject()
      ).toEqual({ c: 3, d: 4 })

      expect(
        makeModel()
          .setHidden(['a', 'b'])
          .toObject()
      ).toEqual({ c: 3, d: 4 })
    })

    it('.makeVisible() should work with empty visible setting', function() {
      expect(
        makeModel()
          .makeVisible(['a', 'b'])
          .toObject()
      ).toEqual({ a: 1, b: 2, c: 3, d: 4 })
    })

    it('.makeVisible() should work with added visible setting', function() {
      const model = makeModel()
        .addVisible('c')
        .setHidden(['a', 'b', 'd'])
        .makeVisible('a')
      expect(model.toObject()).toEqual({ a: 1, c: 3 })
    })

    it('.makeHidden() should work with empty hidden setting', function() {
      expect(
        makeModel()
          .makeHidden(['a', 'b'])
          .toObject()
      ).toEqual({ c: 3, d: 4 })
    })

    it('.makeHidden() should work with not empty hidden setting', function() {
      expect(
        makeModel()
          .addVisible('a', 'b', 'd')
          .addHidden('c')
          .makeHidden(['b'])
          .toObject()
      ).toEqual({ a: 1, d: 4 })
    })
  })
})
