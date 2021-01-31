import { param_record_type } from '@ctx-core/cli-args';
export declare function cli(): Promise<void>;
export interface RollupCliParam extends param_record_type {
    help: string;
    dir: string;
    build: string;
    compile: string;
    clean: string;
    parallel: string;
    watch: string;
}
