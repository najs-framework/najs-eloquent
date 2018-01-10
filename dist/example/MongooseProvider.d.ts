import { IMongooseProvider } from '../lib';
export declare class MongooseProvider implements IMongooseProvider {
    static className: string;
    getClassName(): string;
    getMongooseInstance(): any;
}
