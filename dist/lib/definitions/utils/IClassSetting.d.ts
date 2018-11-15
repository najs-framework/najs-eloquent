declare namespace NajsEloquent.Util {
    interface ISettingReader<T> {
        (staticValue?: T, sampleValue?: T, instanceValue?: T): T;
    }
    interface IClassSetting {
        /**
         * Read property setting via a setting reader.
         *
         * @param {string} property
         * @param {Function} reader
         */
        read<T>(property: string, reader: ISettingReader<T>): T;
        /**
         * Get the "sample" instance.
         */
        getSample<T extends Object>(): T;
        /**
         * Get definition of the class.
         */
        getDefinition(): Function;
    }
}
