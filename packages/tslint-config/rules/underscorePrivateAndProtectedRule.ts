import * as Lint from 'tslint';
import * as ts from 'typescript';

const UNDERSCORE = '_';

type RelevantClassMember =
  | ts.MethodDeclaration
  | ts.PropertyDeclaration
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration;

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'private and protected members must be prefixed with an underscore';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>): void {
  function traverse(node: ts.Node): void {
    checkNodeForViolations(ctx, node);
    return ts.forEachChild(node, traverse);
  }

  traverse(ctx.sourceFile);
}

function checkNodeForViolations(ctx: Lint.WalkContext<void>, node: ts.Node): void {
  if (!isRelevantClassMember(node)) {
    return;
  }

  const name = node.name;
  if (!nameIsIdentifier(name)) {
    return;
  }

  if (!nameStartsWithUnderscore(name.text) && memberIsPrivateOrProtected(node)) {
    ctx.addFailureAtNode(name, Rule.FAILURE_STRING);
  }
}

function isRelevantClassMember(node: ts.Node): node is RelevantClassMember {
  switch (node.kind) {
    case ts.SyntaxKind.MethodDeclaration:
    case ts.SyntaxKind.PropertyDeclaration:
    case ts.SyntaxKind.GetAccessor:
    case ts.SyntaxKind.SetAccessor:
      return true;
    default:
      return false;
  }
}

function nameStartsWithUnderscore(text: string): boolean {
  return text.charCodeAt(0) === UNDERSCORE.charCodeAt(0);
}

function memberIsPrivateOrProtected(node: ts.Declaration): boolean {
  return Lint.hasModifier(node.modifiers, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword);
}

function nameIsIdentifier(node: ts.Node): node is ts.Identifier {
  return node.kind === ts.SyntaxKind.Identifier;
}
