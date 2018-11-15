import { QueryBuilderHandlerBase } from '../QueryBuilderHandlerBase'

export class ExecutorUtils {
  static addSoftDeleteConditionIfNeeded(handler: QueryBuilderHandlerBase) {
    if (handler.shouldAddSoftDeleteCondition()) {
      const settings = handler.getSoftDeletesSetting()
      handler.getConditionQuery().whereNull(settings.deletedAt)
      handler.markSoftDeleteState('added')
    }
  }
}
