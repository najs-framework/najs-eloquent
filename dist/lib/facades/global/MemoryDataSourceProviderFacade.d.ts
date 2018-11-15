/// <reference path="../../contracts/MemoryDataSourceProvider.d.ts" />
import '../../providers/MemoryDataSourceProvider';
import { Record } from '../../drivers/Record';
import { IFacade, IFacadeBase } from 'najs-facade';
export declare const MemoryDataSourceProviderFacade: Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> & IFacade;
export declare const MemoryDataSourceProvider: Najs.Contracts.Eloquent.MemoryDataSourceProvider<Record> & IFacadeBase;
