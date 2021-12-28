#!/usr/bin/env node
import { stat } from 'fs/promises'
import { dirname } from 'path'
import { cli } from '../lib/index.js'
await cli({ package_json_path_, })
async function package_json_path_(path) {
	const dirname_path = dirname(path)
	if (path === dirname_path) return
	const package_json_path = `${path}/package.json`
	const tsconfig_path = `${path}/tsconfig.json`
	if ((await stat(package_json_path)).isFile() && (await stat(tsconfig_path)).isFile()) {
		return package_json_path
	}
	return await package_json_path_(dirname_path)
}
