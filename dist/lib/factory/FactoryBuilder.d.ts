import { ChanceFaker } from './FactoryManager';
export declare class FactoryBuilder {
    protected className: string;
    protected name: string;
    protected definitions: Object;
    protected states: Object;
    protected faker: ChanceFaker;
    constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker);
}
