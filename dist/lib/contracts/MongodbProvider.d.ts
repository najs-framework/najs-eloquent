declare namespace Najs.Contracts.Eloquent {
    interface MongodbProvider<MongoClient, Database> extends Najs.Contracts.Autoload {
        /**
         * Connect to the mongodb server with uri
         */
        connect(url: string): Promise<this>;
        /**
         * Close current connection
         */
        close(): this;
        /**
         * Get the MongoClient instance.
         */
        getMongoClient(): MongoClient;
        /**
         * Get the Database instance.
         *
         * @param {string} dbName
         */
        getDatabase(dbName?: string): Database;
    }
}
