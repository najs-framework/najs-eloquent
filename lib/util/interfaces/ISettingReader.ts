namespace NajsEloquent.Util {
  export interface ISettingReader<T> {
    (staticValue?: T, sampleValue?: T, instanceValue?: T): T
  }
}
