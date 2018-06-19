/// <reference path="../../contracts/KnexProvider.d.ts" />
import '../../providers/KnexProvider';
import { IFacade, IFacadeBase } from 'najs-facade';
import * as Knex from 'knex';
export interface IKnexProviderFacade extends Najs.Contracts.Eloquent.KnexProvider<Knex, Knex.QueryBuilder, Knex.Config> {
}
export declare const KnexProviderFacade: IKnexProviderFacade & IFacade;
export declare const KnexProvider: IKnexProviderFacade & IFacadeBase;
