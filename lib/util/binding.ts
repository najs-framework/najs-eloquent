import { DriverProvider } from '../facades/global/DriverProviderFacade'

export function bind_driver_if_needed(modelName: string, driverName: string, driverClass: any) {
  if (!DriverProvider.has(driverClass)) {
    DriverProvider.register(driverClass, driverName)
    DriverProvider.bind(modelName, driverName)
  }
}
