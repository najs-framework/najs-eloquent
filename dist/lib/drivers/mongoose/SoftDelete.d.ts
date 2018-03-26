import { EloquentSoftDelete } from '../../model/EloquentMetadata';
import { Schema } from 'mongoose';
export declare function SoftDelete(schema: Schema, options: EloquentSoftDelete | boolean): void;
