export class ExecutorBase {
  private executeMode: string = 'default'

  setExecuteMode(mode: 'default' | 'disabled'): this {
    this.executeMode = mode

    return this
  }

  shouldExecute(): boolean {
    return this.executeMode !== 'disabled'
  }
}
