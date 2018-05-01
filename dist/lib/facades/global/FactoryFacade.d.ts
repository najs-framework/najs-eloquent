import '../../factory/FactoryManager';
import { IFacade, IFacadeBase } from 'najs-facade';
import { IFactory } from '../../factory/interfaces/IFactory';
import { IFactoryManager } from '../../factory/interfaces/IFactoryManager';
import { ChanceFaker } from '../../factory/FactoryManager';
export declare const FactoryFacade: IFactoryManager<ChanceFaker> & IFacade;
export declare const Factory: IFactoryManager<ChanceFaker> & IFacadeBase;
export declare const factory: IFactory;
