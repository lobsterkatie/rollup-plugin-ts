import * as TSModule from "typescript";
import {TypescriptPluginOptions} from "../../plugin/typescript-plugin-options";
import {ensureAbsolute} from "../path/path-util";
import path from "crosspath";

/**
 * Gets normalized PluginOptions based on the given ones
 */
export function getPluginOptions(options: Partial<TypescriptPluginOptions>): TypescriptPluginOptions {
	// Destructure the options and provide defaults
	const {
		browserslist,
		transpiler = "typescript",
		typescript = TSModule,
		cwd = path.normalize(process.cwd()),
		tsconfig,
		transformers,
		include = [],
		exclude = [],
		transpileOnly = false,
		debug = false,
		fileSystem = typescript.sys,
		hook = {}
	} = options;

	// These options will be used no matter what
	const baseOptions = {
		typescript,
		browserslist,
		cwd: ensureAbsolute(process.cwd(), cwd),
		exclude,
		include,
		transformers,
		tsconfig,
		transpileOnly,
		debug,
		fileSystem,
		hook
	};

	switch (transpiler) {
		case "babel": {
			return {
				...baseOptions,
				...("babelConfig" in options ? {babelConfig: options.babelConfig} : {}),
				transpiler: "babel"
			};
		}

		case "swc": {
			return {
				...baseOptions,
				...("swcConfig" in options ? {swcConfig: options.swcConfig} : {}),
				transpiler: "swc"
			};
		}

		// TypeScript
		default: {
			return {
				...baseOptions,
				transpiler: "typescript"
			};
		}
	}
}
