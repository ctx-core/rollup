import { param_record_T } from '@ctx-core/cli-args';
export declare function cli(): Promise<void>;
export interface RollupCliParam extends param_record_T {
    help: string;
    dir: string;
    build: string;
    compile: string;
    clean: string;
    parallel: string;
    watch: string;
}
