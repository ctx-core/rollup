#!/usr/bin/env node
import { param_r_ } from '@ctx-core/cli-args'
import { import_meta_env_ } from '@ctx-core/env'
import { readFileSync } from 'fs'
/**
 * list project rollup entries {file,script} based on ./rollup.json
 * @module @ctx-core/rollup/rollup-cmd
 * @example
 * #!/bin/sh
 * rollup-cmd.js -t http
 * # http build file list
 * rollup-cmd.js -t browser
 * # browser build file list
 */
console.info(cmd_rollup_())
module.exports = cmd_rollup_
function cmd_rollup_() {
	const param_r = param_r_(process.argv.slice(2), {
		config: '-c, --config',
		help: '-h, --help',
		target: '-t, --target',
		watch: '-w, --watch',
	})
	const help = !!param_r.help
	if (help) return help_msg_()
	const suffix = (param_r['--'] || []).join(' ')
	const config_file =
		param_r.config?.[0]
		|| import_meta_env_().ROLLUP_JSON
		|| './rollup.json'
	const target = param_r.target?.[0]
	const watch = !!u.watch
	const config_json = readFileSync(config_file, 'utf8')
	const config = JSON.parse(config_json)
	const config_target_cmd_a = config[target] || []
	const { length } = config_target_cmd_a
	const code =
		watch
			? watch_code_()
			: cmds_code_()
	return code
	function cmds_code_() {
		const cmds = []
		for (let i = 0; i < length; i++) {
			const cmd__target = config_target_cmd_a[i]
			let cmd = ''
			if (/^\$/.test(cmd__target)) {
				cmd += cmd__target.replace(/^\$/, '')
			} else {
				cmd += `rollup -c '${cmd__target}'`
			}
			if (suffix) {
				cmd += (' ' + suffix)
			}
			cmds.push(cmd)
		}
		return cmds.join('\n')
	}
	function watch_code_() {
		const windows_cmd_a = []
		const send_keys_cmd_a = []
		for (let i = 0; i < length; i++) {
			const target_cmd = config_target_cmd_a[i]
			let cmd = ''
			if (/^\$/.test(target_cmd)) {
				cmd += target_cmd.replace(/^\$/, '')
			} else {
				cmd += `rollup -c '${target_cmd}'`
			}
			if (watch) {
				cmd += ' --watch'
			}
			if (suffix) {
				cmd += ` ${suffix}`
			}
			if (i) {
				windows_cmd_a.push(`tmux split-window`)
			}
			const tmux_cmds =
				['[ -f ~/.bashrc ] && . ~/.bashrc || [ -f ~/.bash_profile ] && . ~/.bash_profile',
					'direnv reload',
					cmd]
			for (let j = 0; j < tmux_cmds.length; j++) {
				const tmux_cmd = tmux_cmds[j]
				send_keys_cmd_a.push(
					`tmux send-keys -t ${target}:window.${i} "${tmux_cmd}" C-m`)
			}
		}
		const watch_code = [
			`tmux new-session -s ${target} -n window -y 1000 -d`,
			...windows_cmd_a,
			'tmux select-layout even-vertical',
			...send_keys_cmd_a,
			`tmux attach -t ${target}`
		].join('\n')
		return watch_code
	}
}
function help_msg_() {
	return `
Usage: rollup-cmd.js [-c <config-file>] [-t <target>]

Options:

-c, --config	Use config file (defaults to './rollup.json')
-t, --target 	Use build target defined in config file (defaults to 'browser')
-h, --help		This help message
		`.trim()
}
