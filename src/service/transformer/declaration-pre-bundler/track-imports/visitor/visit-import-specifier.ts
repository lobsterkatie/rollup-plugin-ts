import {ImportSpecifier, isStringLiteralLike} from "typescript";
import {TrackImportsVisitorOptions} from "../track-imports-visitor-options";

/**
 * Visits the given ImportSpecifier.
 * @param {TrackImportsVisitorOptions<ImportSpecifier>} options
 * @returns {ImportSpecifier | undefined}
 */
export function visitImportSpecifier({
	node,
	sourceFile,
	resolver,
	markAsImported
}: TrackImportsVisitorOptions<ImportSpecifier>): ImportSpecifier | undefined {
	const moduleSpecifier =
		node.parent == null || node.parent.parent == null || node.parent.parent.parent == null ? undefined : node.parent.parent.parent.moduleSpecifier;

	const originalModule = moduleSpecifier == null || !isStringLiteralLike(moduleSpecifier) ? sourceFile.fileName : resolver(moduleSpecifier.text, sourceFile.fileName) ?? sourceFile.fileName;

	markAsImported({
		node,
		originalModule,
		defaultImport: false,
		name: node.name.text,
		propertyName: node.propertyName == null ? undefined : node.propertyName.text
	});

	// Leave out the ImportSpecifier
	return undefined;
}
