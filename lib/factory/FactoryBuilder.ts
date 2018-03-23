import { ChanceFaker } from './FactoryManager'

export class FactoryBuilder {
  protected className: string
  protected name: string
  protected definitions: Object
  protected states: Object
  protected faker: ChanceFaker

  constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker) {
    this.className = className
    this.name = name
    this.definitions = definitions
    this.states = states
    this.faker = faker
  }
}
