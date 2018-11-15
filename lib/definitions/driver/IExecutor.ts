namespace NajsEloquent.Driver {
  export interface IExecutor {
    /**
     * Set execute mode, can set to "disabled" then nothing will executed in db.
     *
     * @param {string} mode
     */
    setExecuteMode(mode: 'default' | 'disabled'): this

    /**
     * Determine that should execute a query/command or not.
     */
    shouldExecute(): boolean
  }
}
