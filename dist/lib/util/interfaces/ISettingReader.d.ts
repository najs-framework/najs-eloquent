declare namespace NajsEloquent.Util {
    interface ISettingReader<T> {
        (staticValue?: T, sampleValue?: T, instanceValue?: T): T;
    }
}
