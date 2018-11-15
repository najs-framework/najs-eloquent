import 'jest'
import { FacadeContainer } from 'najs-facade'
import { container } from '../../lib/facades/container'

describe('Najs Facade Container', function() {
  it('is an instance of FacadeContainer, it has global reference called "NajsEloquent"', function() {
    expect(container).toBeInstanceOf(FacadeContainer)
    expect(global['NajsEloquent'] === container).toBe(true)
  })
})
