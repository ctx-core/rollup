import fs from 'fs'
import { promisify } from 'util'
import { dirname } from 'path'
import { _param_h, param_record_T } from '@ctx-core/cli-args'
const exists = promisify(fs.exists)
import globby from 'globby'
import { queue_ } from '@ctx-core/queue'
import { piped_a_ } from '@ctx-core/pipe'
const exec = promisify(require('child_process').exec)
let piped_a:string[]
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
	}) as RollupCliParam
	if (help) {
		console.info(help_msg_())
		process.exit(0)
	}
	const dir = dir_param || process.cwd()
	const parallel = parseInt(parallel_param)
	const opts = {
		dir,
		parallel,
	}
	piped_a = await piped_a_()
	if (build_param) {
		await enqueue_fn(script, opts)
	} else if (clean_param) {
		await enqueue_fn(clean, opts)
	} else if (compile_param) {
		await enqueue_fn(compile, opts)
	} else if (watch_param) {
		await enqueue_fn(compile, opts)
		await watch(dir)
	} else {
		await enqueue_fn(compile, opts)
	}
}
function help_msg_() {
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
async function src_a_(dir:string) {
	return globby(pattern_a_(dir), { gitignore: true })
}
async function enqueue_fn<I>(fn:(path:string)=>Promise<I>, { dir, parallel }:enueue_fn_params_I) {
	const package_json_path_a = await package_json_path_a_(dir)
	if (parallel) {
		const queue = queue_(parallel)
		return Promise.all(
			package_json_path_a.map(
				package_json_path=>
					queue.add(async ()=>{
						const ret = await fn(package_json_path)
						console.debug(package_json_path)
						return ret
					})))
	} else {
		const out_a:I[] = []
		for (let i = 0; i < package_json_path_a.length; i++) {
			const package_json_path = package_json_path_a[i]
			console.debug(package_json_path)
			out_a.push(
				await fn(package_json_path)
			)
		}
		return out_a
	}
}
export interface enueue_fn_params_I {
	dir:string
	parallel:number
}
async function script(package_json_path:string) {
	return await run(package_json_path, 'build')
}
async function clean(package_json_path:string) {
	return await run(package_json_path, 'clean')
}
async function compile(package_json_path?:string) {
	return await run(package_json_path, 'compile')
}
async function package_json_path_a_(dir:string) {
	const src_a = piped_a ? piped_a : await src_a_(dir)
	const set = new Set() as Set<string>
	await Promise.all(src_a.map(async src=>{
		const package_json_path = await package_json_path_(src)
		if (package_json_path) {
			set.add(package_json_path)
		}
	}))
	return Array.from(set) as string[]
}
async function run(package_json_path:string|undefined, script:string) {
	if (package_json_path && await exists(package_json_path)) {
		const { stdout, stderr } =
			await exec(`cd ${dirname(package_json_path)}; npm run ${script} --if-present`)
		if (stdout) console.info(stdout)
		if (stderr) console.error(stderr)
	}
}
async function watch(dir:string) {
	const dir_a = await globby(pattern_a_(dir), { gitignore: true })
	const chokidar = await import('chokidar')
	const watcher = chokidar.watch(dir_a)
	watcher.on(
		'change',
		async path=>
			compile(await package_json_path_(path)))
}
async function package_json_path_(path:string):Promise<string|undefined> {
	const dirname_path = dirname(path)
	if (path === dirname_path) return
	const package_json_path = `${path}/package.json`
	const tsconfig_path = `${path}/tsconfig.json`
	if (await exists(package_json_path) && await exists(tsconfig_path)) {
		return package_json_path
	}
	return await package_json_path_(dirname_path)
}
function pattern_a_(dir:string) {
	return [
		`${dir}/**/*.ts`,
		`${dir}/**/rollup.config.js`,
		`${dir}/**/tsconfig.json`,
		`${dir}/**/package.json`,
		`${dir}/**/*.svelte`,
	]
}
export interface RollupCliParam extends param_record_T {
	help:string
	dir:string
	build:string
	compile:string
	clean:string
	parallel:string
	watch:string
}
