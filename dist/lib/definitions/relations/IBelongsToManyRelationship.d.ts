/// <reference path="IManyToMany.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IBelongsToManyRelationship<T> extends IManyToMany<T> {
        /**
         * Attach an model to relation with model's id.
         *
         * @param {string} id
         */
        attach(id: string): Promise<this>;
        /**
         * Attach an model to relation with model's id and custom pivot data
         *
         * @param {string} id
         * @param {object} pivotData
         */
        attach(id: string, pivotData: object): Promise<this>;
        /**
         * Attach models to relation with models' id.
         *
         * @param {string} ids
         */
        attach(ids: string[]): Promise<this>;
        /**
         * Attach models to relation with models' id.
         *
         * @param {string} ids
         */
        attach(ids: string[], pivotData: object): Promise<this>;
        /**
         * Attach models to relation with model id in key and pivot data is value
         *
         * @param {string} data, format:
         *   {
         *     [model id]: { pivot data...},
         *     ...
         *   }
         */
        attach(data: {
            [key in string]: object;
        }): Promise<this>;
        /**
         * Detach an model to relation with model's id.
         *
         * @param {string} id
         */
        detach(id: string): Promise<this>;
        /**
         * Detach models to relation with models' id.
         *
         * @param {string} ids
         */
        detach(ids: string[]): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} id
         */
        sync(id: string): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} id
         * @param {boolean} detaching
         */
        sync(id: string, detaching: boolean): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} id
         * @param {object} pivotData
         * @param {boolean} detaching
         */
        sync(id: string, pivotData: object): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} id
         * @param {object} pivotData
         * @param {boolean} detaching
         */
        sync(id: string, pivotData: object, detaching: boolean): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string[]} ids
         */
        sync(ids: string[]): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string[]} ids
         * @param {boolean} detaching
         */
        sync(ids: string[], detaching: boolean): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string[]} ids
         * @param {object} pivotData
         */
        sync(ids: string[], pivotData: object): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string[]} ids
         * @param {object} pivotData
         * @param {boolean} detaching
         */
        sync(ids: string[], pivotData: object, detaching: boolean): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} data, format:
         *   {
         *     [model id]: { pivot data...},
         *     ...
         *   }
         */
        sync(data: object): Promise<this>;
        /**
         * Sync models to relation with model id in key and pivot data is value
         *
         * @param {string} data, format:
         *   {
         *     [model id]: { pivot data...},
         *     ...
         *   }
         * @param {boolean} detaching
         */
        sync(data: object, detaching: boolean): Promise<this>;
    }
}
