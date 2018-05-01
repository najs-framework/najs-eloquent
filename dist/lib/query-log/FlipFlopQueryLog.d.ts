/// <reference path="../contracts/QueryLog.d.ts" />
import { Facade } from 'najs-facade';
export declare class FlipFlopQueryLog extends Facade implements Najs.Contracts.Eloquent.QueryLog {
    static className: string;
    protected flip: Najs.Contracts.Eloquent.QueryLogItem<any>[];
    protected flop: Najs.Contracts.Eloquent.QueryLogItem<any>[];
    protected circle: 'flip' | 'flop';
    protected enabled: boolean;
    constructor();
    getClassName(): string;
    protected assign_if_last_argument_is(type: string, args: ArrayLike<any>): any;
    protected parse_pull_arguments_starts_with_string(args: ArrayLike<any>): {
        group: any;
        since: any;
        until: any;
        transform: any;
    };
    protected parse_pull_arguments_starts_with_moment(args: ArrayLike<any>): {
        since: any;
        until: any;
        group: any;
        transform: any;
    };
    protected parse_pull_arguments_starts_with_function(args: ArrayLike<any>): {
        transform: any;
        group: any;
        since: any;
        until: any;
    };
    isEnabled(): boolean;
    enable(): any;
    disable(): any;
    clear(): any;
    push(query: any, group?: string): any;
    parsePullArguments(args: ArrayLike<any>): any;
    pull(): any;
    static sortByWhenAsc(a: Najs.Contracts.Eloquent.QueryLogItem<any>, b: Najs.Contracts.Eloquent.QueryLogItem<any>): number;
}
