import * as Lint from 'tslint';
import * as ts from 'typescript';

import { AsyncSuffixWalker } from './walkers/asyncSuffixWalker';

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new AsyncSuffixWalker(sourceFile, this.getOptions()));
  }
}
