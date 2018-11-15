"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DriverProviderFacade_1 = require("../facades/global/DriverProviderFacade");
function bind_driver_if_needed(modelName, driverName, driverClass) {
    if (!DriverProviderFacade_1.DriverProvider.has(driverClass)) {
        DriverProviderFacade_1.DriverProvider.register(driverClass, driverName);
        DriverProviderFacade_1.DriverProvider.bind(modelName, driverName);
    }
}
exports.bind_driver_if_needed = bind_driver_if_needed;
