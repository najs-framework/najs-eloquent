import * as Moment from 'moment';
export interface IQueryLogTransform {
    (item: IQueryLogItem): IQueryLogItem;
}
export interface IQueryLogItem<T = any> {
    query: T;
    when: Moment.Moment;
    group: string;
}
export interface IQueryLog {
    /**
     * Determine the QueryLog is enabled or not
     */
    isEnabled(): boolean;
    /**
     * Enable the QueryLog
     */
    enable(): this;
    /**
     * Disable the QueryLog
     */
    disable(): this;
    /**
     * Clear all query in the QueryLog
     */
    clear(): this;
    /**
     * Push a query to log pool
     *
     * @param {mixed} query
     */
    push<T>(query: T): this;
    /**
     * Push a query to log pool
     *
     * @param {mixed} query
     * @param {string} group
     */
    push(query: any, group: string): this;
    /**
     * Get and delete all queries
     */
    pull(): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     */
    pull(group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     * @param {Moment} since
     */
    pull(group: string, since: Moment.Moment): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     * @param {Moment} since
     * @param {Moment} until
     */
    pull(group: string, since: Moment.Moment, until: Moment.Moment): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     * @param {Moment} since
     * @param {Moment} until
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     */
    pull(group: string, since: Moment.Moment, until: Moment.Moment, transform: IQueryLogTransform): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     * @param {Moment} since
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     */
    pull(group: string, since: Moment.Moment, transform: IQueryLogTransform): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {string} group
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     */
    pull(group: string, transform: IQueryLogTransform): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     */
    pull(since: Moment.Moment): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {string} group
     */
    pull(since: Moment.Moment, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {Moment} until
     */
    pull(since: Moment.Moment, until: Moment.Moment): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {Moment} until
     * @param {string} group
     */
    pull(since: Moment.Moment, until: Moment.Moment, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {Moment} until
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {string} group
     */
    pull(since: Moment.Moment, until: Moment.Moment, transform: IQueryLogTransform, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     */
    pull(since: Moment.Moment, transform: IQueryLogTransform): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {Moment} since
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {string} group
     */
    pull(since: Moment.Moment, transform: IQueryLogTransform, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     */
    pull(transform: IQueryLogTransform): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {string} group
     */
    pull(transform: IQueryLogTransform, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {Moment} since
     */
    pull(transform: IQueryLogTransform, since: Moment.Moment): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {Moment} since
     * @param {Moment} until
     * @param {string} group
     */
    pull(transform: IQueryLogTransform, since: Moment.Moment, group: string): IQueryLogItem[];
    /**
     * Get and delete all queries
     *
     * @param {NajsEloquent.Log.QueryLogTransform} transform
     * @param {Moment} since
     * @param {Moment} until
     * @param {string} group
     */
    pull(transform: IQueryLogTransform, since: Moment.Moment, until: Moment.Moment, group: string): IQueryLogItem[];
}
