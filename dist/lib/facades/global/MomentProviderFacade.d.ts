/// <reference path="../../contracts/MomentProvider.d.ts" />
import '../../providers/MomentProvider';
import { IFacade, IFacadeBase } from 'najs-facade';
import { Moment } from 'moment';
export declare const MomentProviderFacade: Najs.Contracts.Eloquent.MomentProvider<Moment> & IFacade;
export declare const MomentProvider: Najs.Contracts.Eloquent.MomentProvider<Moment> & IFacadeBase;
