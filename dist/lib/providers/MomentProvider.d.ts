/// <reference path="../contracts/MomentProvider.d.ts" />
import { Moment } from 'moment';
import { Facade } from 'najs-facade';
export declare class MomentProvider extends Facade implements Najs.Contracts.Eloquent.MomentProvider<Moment> {
    getClassName(): string;
    make(): Moment;
    isMoment(value: any): boolean;
    setNow(cb: () => any): this;
}
