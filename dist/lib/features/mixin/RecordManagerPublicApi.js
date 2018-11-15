"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelEvent_1 = require("../../model/ModelEvent");
exports.RecordManagerPublicApi = {
    getRecordName() {
        return this.driver.getRecordManager().getRecordName(this);
    },
    getRecord() {
        return this.driver.getRecordManager().getRecord(this);
    },
    getAttributes() {
        return this.driver.getRecordManager().toObject(this);
    },
    formatAttributeName(name) {
        return this.driver.getRecordManager().formatAttributeName(this, name);
    },
    getAttribute(key) {
        return this.driver.getRecordManager().getAttribute(this, key);
    },
    setAttribute(key, value) {
        this.driver.getRecordManager().setAttribute(this, key, value);
        return this;
    },
    hasAttribute(key) {
        return this.driver.getRecordManager().hasAttribute(this, key);
    },
    getPrimaryKey() {
        return this.driver.getRecordManager().getPrimaryKey(this);
    },
    setPrimaryKey(value) {
        this.driver.getRecordManager().setPrimaryKey(this, value);
        return this;
    },
    getPrimaryKeyName() {
        return this.driver.getRecordManager().getPrimaryKeyName(this);
    },
    markModified(...keys) {
        this.driver.getRecordManager().markModified(this, arguments);
        return this;
    },
    isModified(...keys) {
        return this.driver.getRecordManager().isModified(this, arguments);
    },
    getModified() {
        return this.driver.getRecordManager().getModified(this);
    },
    isNew() {
        return this.driver.getRecordManager().isNew(this);
    },
    async create() {
        await this.fire(ModelEvent_1.ModelEvent.Creating);
        await this.driver
            .getRecordManager()
            .getRecordExecutor(this)
            .create();
        await this.fire(ModelEvent_1.ModelEvent.Created);
        return this;
    },
    async update() {
        await this.fire(ModelEvent_1.ModelEvent.Updating);
        await this.driver
            .getRecordManager()
            .getRecordExecutor(this)
            .update();
        await this.fire(ModelEvent_1.ModelEvent.Updated);
        return this;
    },
    async save() {
        await this.fire(ModelEvent_1.ModelEvent.Saving);
        if (this.isNew()) {
            await this.create();
        }
        else {
            await this.update();
        }
        await this.fire(ModelEvent_1.ModelEvent.Saved);
        return this;
    },
    async delete() {
        await this.fire(ModelEvent_1.ModelEvent.Deleting);
        if (this.driver.getSoftDeletesFeature().hasSoftDeletes(this)) {
            await this.driver
                .getRecordManager()
                .getRecordExecutor(this)
                .softDelete();
        }
        else {
            await this.driver
                .getRecordManager()
                .getRecordExecutor(this)
                .hardDelete();
        }
        await this.fire(ModelEvent_1.ModelEvent.Deleted);
        return this;
    }
};
