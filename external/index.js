import { reject } from 'ctx-core/array'
import { builtinModules } from 'module'
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
