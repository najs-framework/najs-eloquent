export declare function init_mongoose(mongoose: any, name: string): Promise<any>;
export declare function delete_collection(mongoose: any, collection: string): Promise<any>;
export declare function init_mongodb(name: string): any;
export declare function delete_collection_use_mongodb(name: string): any;
export declare function init_knex(database: string): Promise<any>;
export declare function knex_run_sql(sql: string): Promise<any>;
