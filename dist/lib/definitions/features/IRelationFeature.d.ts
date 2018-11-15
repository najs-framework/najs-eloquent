/// <reference path="IFeature.d.ts" />
/// <reference path="../model/IModel.d.ts" />
/// <reference path="../relations/IRelationDataBucket.d.ts" />
declare namespace NajsEloquent.Feature {
    interface IRelationFeature extends IFeature {
        /**
         * Make an RelationDataBucket instance which used by the driver.
         *
         * @param {Model} model
         */
        makeDataBucket(model: Model.IModel): Relation.IRelationDataBucket;
        /**
         * Make a relation factory instance.
         *
         * @param {Model} model
         * @param {string} accessor
         * @param {boolean} isSample
         */
        makeFactory(model: Model.IModel, accessor: string): Relation.IRelationshipFactory;
        /**
         * Set attached data bucket of model instance.
         *
         * @param {Model} model
         */
        getDataBucket(model: Model.IModel): Relation.IRelationDataBucket | undefined;
        /**
         * Set the data bucket to model instance.
         *
         * @param {Model} model
         * @param {RelationDataBucket} dataBucket
         */
        setDataBucket(model: Model.IModel, dataBucket: Relation.IRelationDataBucket): void;
        /**
         * Create a key which is used by RelationDataBucket to distinct the tables/collections.
         *
         * @param {Model} model
         */
        createKeyForDataBucket(model: Model.IModel): string;
        /**
         * Get DataReader which read raw data in DataBucket
         */
        getDataReaderForDataBucket(): Data.IDataReader<any>;
        /**
         * Get raw data which is stored in DataBucket
         *
         * @param {Model} model
         */
        getRawDataForDataBucket<R>(model: Model.IModel): R;
        /**
         * Get an empty value for relationship foreign key.
         */
        getEmptyValueForRelationshipForeignKey(model: Model.IModel, key: string): any;
        /**
         * Get an empty value for relation when it is serialized.
         */
        getEmptyValueForSerializedRelation(model: Model.IModel, key: string): any;
        /**
         * Get defined relations of given model.
         *
         * @param {Model} model
         */
        getDefinitions(model: Model.IModel): Relation.RelationDefinitions;
        /**
         * Build a defined relations data for given model.
         *
         * @param {Model} model
         * @param {object} prototype
         * @param {object[]} bases
         */
        buildDefinitions(model: Model.IModel, prototype: object, bases: object[]): Relation.RelationDefinitions;
        /**
         * Find a relation of give model by given name.
         *
         * @param {Model} model
         * @param {string} name
         */
        findByName<T = {}>(model: Model.IModel, name: string): Relation.IRelationship<T>;
        /**
         * Find relation data by given name.
         */
        findDataByName<T>(model: Model.IModel, name: string): Relation.IRelationData<T>;
        /**
         * Determine that the given relation is loaded or not.
         *
         * @param {Model} model
         */
        isLoadedRelation(model: Model.IModel, relation: string): boolean;
        /**
         * Get loaded relations of given model.
         *
         * @param {Model} model
         */
        getLoadedRelations(model: Model.IModel): Relation.IRelationship<any>[];
        /**
         * Define an relation accessor for given model.
         *
         * @param {Model} model
         * @param {string} accessor
         */
        defineAccessor(model: Model.IModel, accessor: string): void;
    }
}
