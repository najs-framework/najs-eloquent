export declare class ExecutorBase {
    private executeMode;
    setExecuteMode(mode: 'default' | 'disabled'): this;
    shouldExecute(): boolean;
}
