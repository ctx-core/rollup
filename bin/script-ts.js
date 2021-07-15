#!/usr/bin/env node
import { promisify } from 'util'
import { exists } from 'fs'
const exists_async = promisify(exists)
import { dirname } from 'path'
import { cli } from '../dist/index.js'
cli({
	package_json_path_,
})
async function package_json_path_(path) {
	const dirname_path = dirname(path)
	if (path === dirname_path) return
	const package_json_path = `${path}/package.json`
	const tsconfig_path = `${path}/tsconfig.json`
	if (await exists_async(package_json_path) && await exists_async(tsconfig_path)) {
		return package_json_path
	}
	return await package_json_path_(dirname_path)
}
