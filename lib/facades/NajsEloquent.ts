import { FacadeContainer, IFacadeContainer } from 'najs-facade'

class NajsEloquentBag extends FacadeContainer {}

export const NajsEloquent: IFacadeContainer = new NajsEloquentBag()
