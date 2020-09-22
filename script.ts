import { _param_h, param_record_type } from '@ctx-core/cli-args'
import fs from 'fs'
import { promisify } from 'util'
import { dirname } from 'path'
const exists = promisify(fs.exists)
import globby from 'globby'
import { _queue } from '@ctx-core/queue'
import { _a1__piped } from '@ctx-core/pipe'
const exec = promisify(require('child_process').exec)
let piped_a1: string[]
interface Param extends param_record_type {
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
	} = _param_h(process.argv.slice(2), {
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
	piped_a1 = await _a1__piped()
	if (build_param) {
		await enueue_fn(script, opts)
	} else if (clean_param) {
		await enueue_fn(clean, opts)
	} else if (compile_param) {
		await enueue_fn(compile, opts)
	} else if (watch_param) {
		await enueue_fn(compile, opts)
		await watch(dir)
	} else {
		await enueue_fn(compile, opts)
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
async function _src_a1(dir) {
	return globby(_pattern_a1(dir), { gitignore: true })
}
async function enueue_fn<I>(fn: (path: string) => Promise<I>, { dir, parallel }) {
	const package_json_path_a1 = await _package_json_path_a1(dir)
	if (parallel) {
		const queue = _queue(parallel)
		return Promise.all(
			package_json_path_a1.map(
				package_json_path=>
					queue.add(async ()=>{
						const ret = await fn(package_json_path)
						console.debug(package_json_path)
						return ret
					})))
	} else {
		const out_a1 = [] as I[]
		for (let i = 0; i < package_json_path_a1.length; i++) {
			const package_json_path = package_json_path_a1[i]
			console.debug(package_json_path)
			out_a1.push(
				await fn(package_json_path)
			)
		}
		return out_a1
	}
}
async function script(package_json_path: string) {
	return await run(package_json_path, 'build')
}
async function clean(package_json_path: string) {
	return await run(package_json_path, 'clean')
}
async function compile(package_json_path: string) {
	return await run(package_json_path, 'compile')
}
async function _package_json_path_a1(dir: string) {
	const src_a1 = piped_a1 ? piped_a1 : await _src_a1(dir)
	const set = new Set() as Set<string>
	await Promise.all(src_a1.map(async src=>{
		const package_json_path = await _package_json_path(src)
		if (package_json_path) {
			set.add(package_json_path)
		}
	}))
	return Array.from(set) as string[]
}
async function run(package_json_path: string, script: string) {
	if (package_json_path && await exists(package_json_path)) {
		const { stdout, stderr } =
			await exec(`cd ${dirname(package_json_path)}; npm run ${script} --if-present`)
		if (stdout) console.info(stdout)
		if (stderr) console.error(stderr)
	}
}
async function watch(dir) {
	const dir_a1 = await globby(_pattern_a1(dir), { gitignore: true })
	const chokidar = await import('chokidar')
	const watcher = chokidar.watch(dir_a1)
	watcher.on(
		'change',
		async path=>
			compile(await _package_json_path(path)))
}
async function _package_json_path(path) {
	const path__dirname = dirname(path)
	if (path === path__dirname) return
	const package_json_path = `${path}/package.json`
	const tsconfig_path = `${path}/tsconfig.json`
	if (await exists(package_json_path) && await exists(tsconfig_path)) {
		return package_json_path
	}
	return await _package_json_path(path__dirname)
}
function _pattern_a1(dir) {
	return [
		`${dir}/**/*.ts`,
		`${dir}/**/rollup.config.js`,
		`${dir}/**/tsconfig.json`,
		`${dir}/**/package.json`,
		`${dir}/**/*.svelte`,
	]
}
