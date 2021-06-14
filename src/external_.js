import { reject } from '@ctx-core/array';
export function external_(pkg) {
    return reject(Object.keys(pkg.dependencies || {})
        .concat(Object.keys(pkg.devDependencies || {})), path => /(@ctx-core|@sapper)\/.*/.test(path)).concat(require('module').builtinModules
        || (Object.keys(
        // @ts-ignore
        process.binding('natives'))));
}
//# sourceMappingURL=src/external_.js.map