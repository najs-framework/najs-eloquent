/// <reference path="../../contracts/MemoryDataSourceProvider.ts" />

import '../../providers/MemoryDataSourceProvider'
import { Record } from '../../drivers/Record'
import { MemoryDataSourceProvider as MemoryDataSourceProviderClass } from '../../providers/MemoryDataSourceProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { container } from '../container'
import { NajsEloquent } from '../../constants'

const facade = Facade.create<MemoryDataSourceProviderClass>(container, 'MemoryDataSourceProvider', function() {
  return make<MemoryDataSourceProviderClass>(NajsEloquent.Provider.MemoryDataSourceProvider)
})

export const MemoryDataSourceProviderFacade: Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> & IFacade = facade
export const MemoryDataSourceProvider: Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> & IFacadeBase = facade
