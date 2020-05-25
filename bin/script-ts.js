#!/usr/bin/env node
import fs from 'fs'
import { promisify } from 'util'
import { dirname } from 'path'
const exists = promisify(fs.exists)
import { cli } from '../script'
cli({
	_path__package_json,
})
async function _path__package_json(path) {
	const path__dirname = dirname(path)
	if (path === path__dirname) return
	const path__package_json = `${path}/package.json`
	const path__tsconfig = `${path}/tsconfig.json`
	if (await exists(path__package_json) && await exists(path__tsconfig)) {
		return path__package_json
	}
	return await _path__package_json(path__dirname)
}
