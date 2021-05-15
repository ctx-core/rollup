import { reject } from '@ctx-core/array'
export function _external(pkg:_external_pkg_I) {
	return reject(
		Object.keys(pkg.dependencies || {})
			.concat(Object.keys(pkg.devDependencies || {})),
		path=>/(@ctx-core|@sapper)\/.*/.test(path)
	).concat(
		require('module').builtinModules
		|| (
			Object.keys(
				// @ts-ignore
				process.binding('natives')
			)
		)
	)
}
export interface _external_pkg_I {
	dependencies?:Record<string, string>
	devDependencies?:Record<string, string>
}
