import { IAutoload } from 'najs-binding';
export declare abstract class Seeder implements IAutoload {
    protected command: any;
    abstract getClassName(): string;
    abstract run(): void;
    setCommand(command: any): this;
    call(className: string): this;
    call(classNames: string[]): this;
    call(...className: string[]): this;
    call(...classNames: Array<string[]>): this;
    protected getOutput(): any;
    invoke(): void;
}
