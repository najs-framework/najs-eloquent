declare namespace NajsEloquent.Model {
    type DynamicAttributeSettings = {
        name: string;
        getter: boolean;
        setter: boolean;
        accessor?: string;
        mutator?: string;
    };
    class IModelDynamicAttribute {
        /**
         * Contains list of known attributes, included Eloquent members and current class members
         */
        protected knownAttributes: string[];
        /**
         * Contains dynamic attributes (AKA accessors and mutators)
         */
        protected dynamicAttributes: {
            [key: string]: DynamicAttributeSettings;
        };
    }
    interface IModelDynamicAttribute {
        /**
         * Determine give key is exists in Model or not.
         *
         * Note: if the given key is function name which exists in model it will returns true
         *
         * @param {string} key
         */
        hasAttribute(key: string): boolean;
    }
}
