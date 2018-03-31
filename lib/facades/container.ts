import { FacadeContainer, IFacadeContainer } from 'najs-facade'

class NajsEloquentBag extends FacadeContainer {}

export const container: IFacadeContainer = new NajsEloquentBag()
