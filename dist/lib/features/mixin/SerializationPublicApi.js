"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function parse_relationsToObject_arguments(args) {
    if (args.length === 0) {
        return { formatName: true, relations: undefined };
    }
    if (args.length === 1 && typeof args[0] === 'boolean') {
        return { formatName: args[0], relations: undefined };
    }
    const startIndex = args.length > 0 && typeof args[0] === 'boolean' ? 1 : 0;
    const rest = [];
    for (let i = startIndex; i < args.length; i++) {
        rest.push(args[i]);
    }
    const formatName = startIndex === 1 ? args[0] : true;
    return {
        formatName: formatName,
        relations: lodash_1.flatten(rest)
    };
}
exports.SerializationPublicApi = {
    getVisible() {
        return this.driver.getSerializationFeature().getVisible(this);
    },
    setVisible(visible) {
        this.driver.getSerializationFeature().setVisible(this, visible);
        return this;
    },
    addVisible() {
        this.driver.getSerializationFeature().addVisible(this, arguments);
        return this;
    },
    makeVisible() {
        this.driver.getSerializationFeature().makeVisible(this, arguments);
        return this;
    },
    isVisible() {
        return this.driver.getSerializationFeature().isVisible(this, arguments);
    },
    getHidden() {
        return this.driver.getSerializationFeature().getHidden(this);
    },
    setHidden(hidden) {
        this.driver.getSerializationFeature().setHidden(this, hidden);
        return this;
    },
    addHidden() {
        this.driver.getSerializationFeature().addHidden(this, arguments);
        return this;
    },
    makeHidden() {
        this.driver.getSerializationFeature().makeHidden(this, arguments);
        return this;
    },
    isHidden() {
        return this.driver.getSerializationFeature().isHidden(this, arguments);
    },
    attributesToObject() {
        return this.driver.getSerializationFeature().attributesToObject(this);
    },
    relationsToObject() {
        const args = parse_relationsToObject_arguments(arguments);
        return this.driver.getSerializationFeature().relationsToObject(this, args.relations, args.formatName);
    },
    toObject(options) {
        return this.driver.getSerializationFeature().toObject(this, options);
    },
    toJSON(options) {
        return this.driver.getSerializationFeature().toObject(this, options);
    },
    toJson(replacer, space) {
        return this.driver.getSerializationFeature().toJson(this, replacer, space);
    }
};
