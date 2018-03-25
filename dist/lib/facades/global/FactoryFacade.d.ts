import '../../factory/FactoryManager';
import { IFacade, IFacadeBase } from 'najs-facade';
import { IFactoryManager } from '../../factory/interfaces/IFactoryManager';
import { IFactory } from '../../factory/interfaces/IFactory';
import { ChanceFaker } from '../../factory/FactoryManager';
export declare const FactoryFacade: IFactoryManager<ChanceFaker> & IFacade;
export declare const Factory: IFactoryManager<ChanceFaker> & IFacadeBase;
export declare const factory: IFactory;
