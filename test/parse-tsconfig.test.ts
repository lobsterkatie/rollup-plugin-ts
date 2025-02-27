import test from "ava";
import {withTypeScript} from "./util/ts-macro";
import {generateRollupBundle} from "./setup/setup-rollup";
import {formatCode} from "./util/format-code";

test.serial("Correctly parse TypeScript config files within sub-directories. #1", withTypeScript, async (t, {typescript}) => {
	const bundle = await generateRollupBundle(
		[
			{
				entry: true,
				fileName: "src/index.ts",
				text: `\
					export function noop(): void {}
				`
			},
			{
				entry: false,
				fileName: "virtual-configs/tsconfig.json",
				text: `\
					{
						"compilerOptions": {
							"target": "es2018",
							"module": "esnext",
							"moduleResolution": "node",
							"baseUrl": "../",
							"rootDir": "../src",
							"outDir": "../dist",
							"declaration": true,
							"declarationMap": true,
							"listEmittedFiles": true,
							"noImplicitAny": true,
							"noImplicitReturns": true,
							"noUnusedLocals": true,
							"noUnusedParameters": true,
							"removeComments": true,
							"sourceMap": true,
							"strict": true
						},
						"include": [
							"../src/**/*.ts"
						],
						"exclude": [
							"../node_modules",
							"../dist"
						]
					}
				`
			}
		],
		{
			typescript,
			debug: false,
			tsconfig: "virtual-configs/tsconfig.json"
		}
	);

	const {
		js: [file]
	} = bundle;

	t.deepEqual(
		formatCode(file.code),
		formatCode(`\
			function noop() {}

			export { noop };
		`)
	);
});

test.serial("Correctly parse TypeScript config files within sub-directories. #2", withTypeScript, async (t, {typescript}) => {
	const bundle = await generateRollupBundle(
		[
			{
				entry: true,
				fileName: "src/index.ts",
				text: `\
					export function noop(): void {}
				`
			},
			{
				entry: false,
				fileName: "virtual-configs/tsconfig.build.json",
				text: `\
					{
						"extends": "./tsconfig.base.json",
						"compilerOptions": {
							"rootDir": "../src",
							"outDir": "../dist"
						},
						"include": [
							"../src/**/*.ts"
						]
					}
				`
			},
			{
				entry: false,
				fileName: "virtual-configs/tsconfig.base.json",
				text: `\
					{
						"compilerOptions": {
							"target": "es2018",
							"module": "esnext",
							"moduleResolution": "node",
							"baseUrl": "../",
							"declaration": true,
							"declarationMap": true,
							"listEmittedFiles": true,
							"noImplicitAny": true,
							"noImplicitReturns": true,
							"noUnusedLocals": true,
							"noUnusedParameters": true,
							"removeComments": true,
							"sourceMap": true,
							"strict": true
						},
						"exclude": [
							"../node_modules",
							"../dist"
						]
					}
				`
			}
		],
		{
			typescript,
			debug: false,
			tsconfig: "virtual-configs/tsconfig.build.json"
		}
	);

	const {
		js: [file]
	} = bundle;

	t.deepEqual(
		formatCode(file.code),
		formatCode(`\
			function noop() {}

			export { noop };
		`)
	);
});
