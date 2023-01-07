import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const PLUGINS = [resolve({ moduleDirectories: [".."] })];
const EXTERNAL = ["single-file-core"];

export default [{
	input: ["single-file-core/single-file.js"],
	output: [{
		file: "lib/single-file.js",
		format: "umd",
		name: "singlefile",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-frames.js"],
	output: [{
		file: "lib/single-file-frames.js",
		format: "umd",
		name: "singlefile",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-bootstrap.js"],
	output: [{
		file: "lib/single-file-bootstrap.js",
		format: "umd",
		name: "singlefileBootstrap",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-hooks-frames.js"],
	output: [{
		file: "lib/single-file-hooks-frames.js",
		format: "iife",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["src/core/content/content-frames.js"],
	output: [{
		file: "lib/single-file-extension-frames.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/index.js"],
	output: [{
		file: "lib/single-file-extension-core.js",
		format: "umd",
		name: "extension",
		plugins: []
	}]
}, {
	input: ["src/lib/single-file/browser-polyfill/chrome-browser-polyfill.js"],
	output: [{
		file: "lib/chrome-browser-polyfill.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/lib/single-file/background.js"],
	output: [{
		file: "lib/single-file-background.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/core/bg/background.js"],
	output: [{
		file: "lib/single-file-extension-background.js",
		format: "iife",
		plugins: []
	}]
}];