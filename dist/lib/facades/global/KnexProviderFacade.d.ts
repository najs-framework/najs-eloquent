/// <reference path="../../contracts/KnexProvider.d.ts" />
import '../../providers/KnexProvider';
import { IFacade, IFacadeBase } from 'najs-facade';
import { QueryBuilder, Config } from 'knex';
export interface IKnexProviderFacade extends Najs.Contracts.Eloquent.KnexProvider<QueryBuilder, Config> {
}
export declare const KnexProviderFacade: IKnexProviderFacade & IFacade;
export declare const KnexProvider: IKnexProviderFacade & IFacadeBase;
