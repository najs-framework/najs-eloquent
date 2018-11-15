"use strict";
/// <reference path="../definitions/features/IRecordExecutor.ts" />
/// <reference path="../definitions/query-builders/IConvention.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const ExecutorBase_1 = require("./ExecutorBase");
const MomentProviderFacade_1 = require("../facades/global/MomentProviderFacade");
class RecordExecutorBase extends ExecutorBase_1.ExecutorBase {
    constructor(model, record, convention) {
        super();
        this.model = model;
        this.record = record;
        this.convention = convention;
    }
    fillData(isCreate) {
        this.fillTimestampsData(isCreate);
        this.fillSoftDeletesData();
    }
    fillTimestampsData(isCreate) {
        const timestampFeature = this.model.getDriver().getTimestampsFeature();
        if (timestampFeature.hasTimestamps(this.model)) {
            const timestampSettings = timestampFeature.getTimestampsSetting(this.model);
            this.record.setAttribute(this.convention.formatFieldName(timestampSettings.updatedAt), MomentProviderFacade_1.MomentProvider.make().toDate());
            if (isCreate) {
                this.setAttributeIfNeeded(this.convention.formatFieldName(timestampSettings.createdAt), MomentProviderFacade_1.MomentProvider.make().toDate());
            }
        }
    }
    fillSoftDeletesData() {
        const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature();
        if (softDeletesFeature.hasSoftDeletes(this.model)) {
            const softDeleteSettings = softDeletesFeature.getSoftDeletesSetting(this.model);
            this.setAttributeIfNeeded(this.convention.formatFieldName(softDeleteSettings.deletedAt), this.convention.getNullValueFor(softDeleteSettings.deletedAt));
        }
    }
    setAttributeIfNeeded(attribute, value) {
        if (typeof this.record.getAttribute(attribute) === 'undefined') {
            this.record.setAttribute(attribute, value);
        }
    }
    async create(shouldFillData = true, action = 'create') {
        if (shouldFillData) {
            this.fillData(true);
        }
        const result = this.createRecord(action);
        this.record.clearModified();
        return result;
    }
    async update(shouldFillData = true, action = 'update') {
        if (!this.hasPrimaryKey()) {
            return false;
        }
        if (shouldFillData) {
            this.fillData(false);
        }
        if (!this.hasModifiedData()) {
            return false;
        }
        const result = this.updateRecord(action);
        this.record.clearModified();
        return result;
    }
    async softDelete() {
        const isNew = this.model.isNew();
        this.fillTimestampsData(isNew);
        const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature();
        this.record.setAttribute(this.convention.formatFieldName(softDeletesFeature.getSoftDeletesSetting(this.model).deletedAt), MomentProviderFacade_1.MomentProvider.make().toDate());
        return isNew ? this.create(false, 'softDelete') : this.update(false, 'softDelete');
    }
    async hardDelete() {
        if (!this.hasPrimaryKey()) {
            return false;
        }
        const result = this.hardDeleteRecord();
        this.record.clearModified();
        return result;
    }
    async restore() {
        const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature();
        const fieldName = softDeletesFeature.getSoftDeletesSetting(this.model).deletedAt;
        this.fillTimestampsData(false);
        this.record.setAttribute(this.convention.formatFieldName(fieldName), this.convention.getNullValueFor(fieldName));
        return this.update(false, 'restore');
    }
    hasPrimaryKey() {
        const primaryKeyValue = this.model.getPrimaryKey();
        if (!primaryKeyValue) {
            return false;
        }
        return true;
    }
    hasModifiedData() {
        return this.record.getModified().length > 0;
    }
}
exports.RecordExecutorBase = RecordExecutorBase;
