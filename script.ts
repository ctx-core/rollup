import { _h__param } from '@ctx-core/cli-args'
const fs = require('fs')
import { promisify } from 'util'
import { dirname } from 'path'
const exists = promisify(fs.exists)
const globby = require('globby')
import { _queue } from '@ctx-core/queue'
import { _a1__piped } from '@ctx-core/pipe'
const exec = promisify(require('child_process').exec)
let a1__piped
interface Param {
	help:string
	dir:string
	build:string
	compile:string
	clean:string
	parallel:string
	watch:string
}
export async function cli() {
	const {
		help,
		dir: dir_param,
		build: build_param,
		compile: compile_param,
		clean: clean_param,
		parallel: parallel_param,
		watch: watch_param,
	} = _h__param(process.argv.slice(2), {
		help: '-h, --help',
		dir: '-d, --dir',
		build: '-b, --build',
		compile: '-c, --compile',
		clean: '-l, --clean',
		parallel: '-p, --parallel',
		watch: '-w, --watch',
	}) as Param
	if (help) {
		console.info(_help_msg())
		process.exit(0)
	}
	const dir = dir_param || process.cwd()
	const parallel = parseInt(parallel_param)
	const opts = {
		dir,
		parallel,
	}
	a1__piped = await _a1__piped()
	if (build_param) {
		await enueue__fn(script, opts)
	} else if (clean_param) {
		await enueue__fn(clean, opts)
	} else if (compile_param) {
		await enueue__fn(compile, opts)
	} else if (watch_param) {
		await enueue__fn(compile, opts)
		await watch(dir)
	} else {
		await enueue__fn(compile, opts)
	}
}
function _help_msg() {
	return `
Usage: ${process.argv[0]} [-d] [-b] [-c] [-p <threads>] [-w]

Options:

-h, --help              This help message
-d, --dir               Root directory
-b, --build             Rebuild the packages
-c, --compile           Compile the packages
-p --parallel <threads> Runs in parallel with threads
-w --watch              Watch files
		`.trim()
}
async function _a1__src(dir) {
	return globby(_a1__pattern(dir), { gitignore: true })
}
async function enueue__fn(fn, { dir, parallel }) {
	const a1__path__package_json = await _a1__path__package_json(dir)
	if (parallel) {
		const queue = _queue(parallel)
		return Promise.all(
			a1__path__package_json.map(
				path__package_json=>
					queue.add(async ()=>{
						const ret = await fn(path__package_json)
						console.debug(path__package_json)
						return ret
					})))
	} else {
		const a1__out = []
		for (let i = 0; i < a1__path__package_json.length; i++) {
			const path__package_json = a1__path__package_json[i]
			console.debug(path__package_json)
			a1__out.push(
				await fn(path__package_json)
			)
		}
		return a1__out
	}
}
async function script(path__package_json) {
	return await run(path__package_json, 'build')
}
async function clean(path__package_json) {
	return await run(path__package_json, 'clean')
}
async function compile(path__package_json) {
	return await run(path__package_json, 'compile')
}
async function _a1__path__package_json(dir) {
	const a1__src =
		a1__piped
		? a1__piped
		: await _a1__src(dir)
	const set = new Set()
	await Promise.all(a1__src.map(async src=>{
		const path__package_json = await _path__package_json(src)
		if (path__package_json) {
			set.add(path__package_json)
		}
	}))
	return Array.from(set)
}
async function run(path__package_json, script) {
	if (path__package_json && await exists(path__package_json)) {
		const { stdout, stderr } =
			await exec(`cd ${dirname(path__package_json)}; npm run ${script} --if-present`)
		if (stdout) console.info(stdout)
		if (stderr) console.error(stderr)
	}
}
async function watch(dir) {
	const a1__dir = await globby(_a1__pattern(dir), { gitignore: true })
	const watcher = require('chokidar').watch(a1__dir)
	watcher.on(
		'change',
		async path=>
			compile(await _path__package_json(path)))
}
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
function _a1__pattern(dir) {
	return [
		`${dir}/**/*.ts`,
		`${dir}/**/rollup.config.js`,
		`${dir}/**/tsconfig.json`,
		`${dir}/**/package.json`,
		`${dir}/**/*.svelte`,
	]
}
