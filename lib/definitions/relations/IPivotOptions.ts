namespace NajsEloquent.Relation {
  export type PivotForeignKey = string

  export interface IPivotOptions {
    foreignKeys: [PivotForeignKey, PivotForeignKey]

    name?: string

    fields?: Array<string>

    timestamps?: Feature.ITimestampsSetting

    softDeletes?: Feature.ISoftDeletesSetting
  }
}
