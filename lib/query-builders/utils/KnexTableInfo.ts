import { KnexProvider } from '../../facades/global/KnexProviderFacade'

export class KnexTableInfo {
  protected table: string
  protected database: string

  constructor(table: string, database?: string) {
    this.table = table
    this.database = database || KnexProvider.getDefaultConfig().connection!['database']
  }

  getPrimaryKeyName(): string {
    return ''
  }

  hasPrimaryKey(): boolean {
    return false
  }

  getColumns(): object {
    return {}
  }

  getTableInfo(): Promise<this> {
    return new Promise(resolve => {
      KnexProvider.createQueryBuilder('information_schema.columns')
        .where('table_name', this.table)
        .where('table_schema', this.database)
        .then(result => {
          resolve(this)
        })
    })
  }
}
