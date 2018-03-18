import { Eloquent } from './Eloquent';
export declare const GET_FORWARD_TO_DRIVER_FUNCTIONS: string[];
export declare const GET_QUERY_FUNCTIONS: string[];
export declare const EloquentProxy: {
    get(target: Eloquent<any>, key: any, value: any): any;
    set(target: Eloquent<any>, key: any, value: any): any;
};
