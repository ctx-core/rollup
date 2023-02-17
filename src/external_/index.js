import { builtinModules } from 'module'
import { reject } from '@ctx-core/array'
export function external_(pkg) {
	return reject(
		Object.keys(pkg.dependencies || {})
			.concat(
				Object.keys(pkg.devDependencies || {})
			),
		path=>
			/(@ctx-core|@sapper)\/.*/.test(path))
		.concat(
			builtinModules
			|| Object.keys(process.binding('natives')))
}
