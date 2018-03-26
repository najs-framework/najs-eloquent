import { IAutoload, make } from 'najs-binding'
import { flatten } from 'lodash'

export abstract class Seeder implements IAutoload {
  protected command: any

  abstract getClassName(): string

  abstract run(): void

  setCommand(command: any): this {
    this.command = command

    return this
  }

  call(className: string): this
  call(classNames: string[]): this
  call(...className: string[]): this
  call(...classNames: Array<string[]>): this
  call(): this {
    flatten(arguments).forEach(function(className: string) {
      const instance = make<Seeder>(className)
      if (instance instanceof Seeder) {
        instance.invoke()
      }
    })
    return this
  }

  protected getOutput() {
    if (this.command) {
      return this.command.getOutput()
    }
    return console
  }

  invoke() {
    this.getOutput().info('<info>Seeding:</info> ' + this.getClassName())
    this.run()
  }
}
