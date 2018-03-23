import { IFactoryBuilder } from './IFactoryBuilder';
export interface IFactory {
    (className: string): IFactoryBuilder;
}
