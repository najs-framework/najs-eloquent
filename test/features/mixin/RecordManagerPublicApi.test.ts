import 'jest'
import * as Sinon from 'sinon'
import { RecordManagerPublicApi } from '../../../lib/features/mixin/RecordManagerPublicApi'

describe('RecordManagerPublicApi', function() {
  const recordManager = {
    getRecordName() {
      return 'getRecordName-result'
    },
    getRecord() {
      return 'getRecord-result'
    },
    formatAttributeName() {
      return 'formatAttributeName-result'
    },
    getAttribute() {
      return 'getAttribute-result'
    },
    setAttribute() {
      return 'setAttribute-result'
    },
    hasAttribute() {
      return 'hasAttribute-result'
    },
    getPrimaryKey() {
      return 'getPrimaryKey-result'
    },
    setPrimaryKey() {
      return 'setPrimaryKey-result'
    },
    getPrimaryKeyName() {
      return 'getPrimaryKeyName-result'
    },
    markModified() {
      return 'markModified-result'
    },
    isModified() {
      return 'isModified-result'
    },
    getModified() {
      return 'getModified-result'
    },
    isNew() {
      return 'isNew-result'
    },
    toObject() {
      return 'toObject-result'
    }
  }

  const model = {
    driver: {
      getRecordManager() {
        return recordManager
      }
    }
  }

  describe('.getRecordName()', function() {
    it('calls and returns RecordManager.getRecordName()', function() {
      const stub = Sinon.stub(recordManager, 'getRecordName')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getRecordName.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.getRecord()', function() {
    it('calls and returns RecordManager.getRecord()', function() {
      const stub = Sinon.stub(recordManager, 'getRecord')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getRecord.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.getAttributes()', function() {
    it('calls and returns RecordManager.toObject()', function() {
      const stub = Sinon.stub(recordManager, 'toObject')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getAttributes.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.formatAttributeName()', function() {
    it('calls and returns RecordManager.formatAttributeName()', function() {
      const stub = Sinon.stub(recordManager, 'formatAttributeName')
      stub.returns('anything')

      expect(RecordManagerPublicApi.formatAttributeName.call(model, 'name')).toEqual('anything')
      expect(stub.calledWith(model, 'name')).toBe(true)
      stub.restore()
    })
  })

  describe('.getAttribute()', function() {
    it('calls and returns RecordManager.getAttribute()', function() {
      const stub = Sinon.stub(recordManager, 'getAttribute')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getAttribute.call(model, 'name')).toEqual('anything')
      expect(stub.calledWith(model, 'name')).toBe(true)
      stub.restore()
    })
  })

  describe('.setAttribute()', function() {
    it('is chainable, calls RecordManager.setAttribute()', function() {
      const stub = Sinon.stub(recordManager, 'setAttribute')
      stub.returns('anything')

      expect(RecordManagerPublicApi.setAttribute.call(model, 'name', 'value') === model).toBe(true)
      expect(stub.calledWith(model, 'name', 'value')).toBe(true)
      stub.restore()
    })
  })

  describe('.hasAttribute()', function() {
    it('calls and returns RecordManager.hasAttribute()', function() {
      const stub = Sinon.stub(recordManager, 'hasAttribute')
      stub.returns('anything')

      expect(RecordManagerPublicApi.hasAttribute.call(model, 'name')).toEqual('anything')
      expect(stub.calledWith(model, 'name')).toBe(true)
      stub.restore()
    })
  })

  describe('.getPrimaryKey()', function() {
    it('calls and returns RecordManager.getPrimaryKey()', function() {
      const stub = Sinon.stub(recordManager, 'getPrimaryKey')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getPrimaryKey.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.setPrimaryKey()', function() {
    it('is chainable, calls RecordManager.setPrimaryKey()', function() {
      const stub = Sinon.stub(recordManager, 'setPrimaryKey')
      stub.returns('anything')

      expect(RecordManagerPublicApi.setPrimaryKey.call(model, 'value') === model).toBe(true)
      expect(stub.calledWith(model, 'value')).toBe(true)
      stub.restore()
    })
  })

  describe('.getPrimaryKeyName()', function() {
    it('calls and returns RecordManager.getPrimaryKeyName()', function() {
      const stub = Sinon.stub(recordManager, 'getPrimaryKeyName')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getPrimaryKeyName.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.markModified()', function() {
    it('is chainable, calls RecordManager.markModified()', function() {
      const stub = Sinon.stub(recordManager, 'markModified')
      stub.returns('anything')

      expect(RecordManagerPublicApi.markModified.call(model, 'a', ['b', 'c']) === model).toBe(true)
      expect(stub.calledWith(model)).toBe(true)
      expect(stub.lastCall.args[1][0]).toEqual('a')
      expect(stub.lastCall.args[1][1]).toEqual(['b', 'c'])
      stub.restore()
    })
  })

  describe('.isModified()', function() {
    it('calls and returns RecordManager.isModified()', function() {
      const stub = Sinon.stub(recordManager, 'isModified')
      stub.returns('anything')

      expect(RecordManagerPublicApi.isModified.call(model, 'a', ['b', 'c'])).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      expect(stub.lastCall.args[1][0]).toEqual('a')
      expect(stub.lastCall.args[1][1]).toEqual(['b', 'c'])
      stub.restore()
    })
  })

  describe('.getModified()', function() {
    it('calls and returns RecordManager.getModified()', function() {
      const stub = Sinon.stub(recordManager, 'getModified')
      stub.returns('anything')

      expect(RecordManagerPublicApi.getModified.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.isNew()', function() {
    it('calls and returns RecordManager.isNew()', function() {
      const stub = Sinon.stub(recordManager, 'isNew')
      stub.returns('anything')

      expect(RecordManagerPublicApi.isNew.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.create()', function() {
    it('fires 2 events Creating & Created, calls RecordExecutor.create() then returns itself', async function() {
      const recordExecutor = {
        create() {}
      }
      const recordManager = {
        getRecordExecutor() {
          return recordExecutor
        }
      }
      const model: any = {
        async fire() {},
        driver: {
          getRecordManager() {
            return recordManager
          }
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const stub = Sinon.stub(recordExecutor, 'create')

      expect((await RecordManagerPublicApi.create.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('creating')).toBe(true)
      expect(fireSpy.secondCall.calledWith('created')).toBe(true)
      expect(stub.called).toBe(true)
    })
  })

  describe('.update()', function() {
    it('fires 2 events Updating & Updated, calls RecordExecutor.update() then returns itself', async function() {
      const recordExecutor = {
        update() {}
      }
      const recordManager = {
        getRecordExecutor() {
          return recordExecutor
        }
      }
      const model: any = {
        async fire() {},
        driver: {
          getRecordManager() {
            return recordManager
          }
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const stub = Sinon.stub(recordExecutor, 'update')

      expect((await RecordManagerPublicApi.update.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('updating')).toBe(true)
      expect(fireSpy.secondCall.calledWith('updated')).toBe(true)
      expect(stub.called).toBe(true)
    })
  })

  describe('.save()', function() {
    it('fires 2 events Saving & Saved, calls this.create() if .isNew() return true, then returns itself', async function() {
      const model: any = {
        async fire() {},
        async create() {},
        async update() {},
        isNew() {
          return true
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const createSpy = Sinon.stub(model, 'create')
      const updateSpy = Sinon.stub(model, 'update')

      expect((await RecordManagerPublicApi.save.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('saving')).toBe(true)
      expect(fireSpy.secondCall.calledWith('saved')).toBe(true)
      expect(createSpy.called).toBe(true)
      expect(updateSpy.called).toBe(false)
    })

    it('fires 2 events Saving & Saved, calls this.update() if .isNew() return false, then returns itself', async function() {
      const model: any = {
        async fire() {},
        async create() {},
        async update() {},
        isNew() {
          return false
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const createSpy = Sinon.stub(model, 'create')
      const updateSpy = Sinon.stub(model, 'update')

      expect((await RecordManagerPublicApi.save.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('saving')).toBe(true)
      expect(fireSpy.secondCall.calledWith('saved')).toBe(true)
      expect(createSpy.called).toBe(false)
      expect(updateSpy.called).toBe(true)
    })
  })

  describe('.delete()', function() {
    it('fires 2 events Deleting & Deleted, calls RecordExecutor.softDelete() if the model has soft deletes, then returns itself', async function() {
      const recordExecutor = {
        softDelete() {},
        hardDelete() {}
      }
      const recordManager = {
        getRecordExecutor() {
          return recordExecutor
        }
      }
      const model: any = {
        async fire() {},
        async create() {},
        async update() {},
        isNew() {
          return false
        },
        driver: {
          getRecordManager() {
            return recordManager
          },
          getSoftDeletesFeature() {
            return {
              hasSoftDeletes() {
                return true
              }
            }
          }
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const softDeleteSpy = Sinon.stub(recordExecutor, 'softDelete')
      const hardDeleteSpy = Sinon.stub(recordExecutor, 'hardDelete')

      expect((await RecordManagerPublicApi.delete.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('deleting')).toBe(true)
      expect(fireSpy.secondCall.calledWith('deleted')).toBe(true)
      expect(softDeleteSpy.called).toBe(true)
      expect(hardDeleteSpy.called).toBe(false)
    })

    it('fires 2 events Deleting & Deleted, calls RecordExecutor.hardDelete() if the model has no soft deletes, then returns itself', async function() {
      const recordExecutor = {
        softDelete() {},
        hardDelete() {}
      }
      const recordManager = {
        getRecordExecutor() {
          return recordExecutor
        }
      }
      const model: any = {
        async fire() {},
        async create() {},
        async update() {},
        isNew() {
          return false
        },
        driver: {
          getRecordManager() {
            return recordManager
          },
          getSoftDeletesFeature() {
            return {
              hasSoftDeletes() {
                return false
              }
            }
          }
        }
      }

      const fireSpy = Sinon.stub(model, 'fire')
      const softDeleteSpy = Sinon.stub(recordExecutor, 'softDelete')
      const hardDeleteSpy = Sinon.stub(recordExecutor, 'hardDelete')

      expect((await RecordManagerPublicApi.delete.call(model)) === model).toBe(true)
      expect(fireSpy.calledTwice).toBe(true)
      expect(fireSpy.firstCall.calledWith('deleting')).toBe(true)
      expect(fireSpy.secondCall.calledWith('deleted')).toBe(true)
      expect(softDeleteSpy.called).toBe(false)
      expect(hardDeleteSpy.called).toBe(true)
    })
  })
})
