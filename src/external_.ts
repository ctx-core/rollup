import { reject } from '@ctx-core/array'
import { builtinModules } from 'module'
export function external_(pkg:external__pkg_I) {
	return reject(
		Object.keys(pkg.dependencies || {})
			.concat(Object.keys(pkg.devDependencies || {})),
		path=>/(@ctx-core|@sapper)\/.*/.test(path)
	).concat(
		builtinModules
		|| (
			Object.keys(
				// @ts-ignore
				process.binding('natives')
			)
		)
	)
}
export interface external__pkg_I {
	dependencies?:Record<string, string>
	devDependencies?:Record<string, string>
}
