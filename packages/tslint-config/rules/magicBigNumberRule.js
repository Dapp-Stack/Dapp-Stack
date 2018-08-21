"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
// tslint:disable:no-unnecessary-type-assertion
/**
 * A modified version of the no-magic-numbers rule that allows for magic numbers
 * when instantiating a BigNumber instance.
 * E.g We want to be able to write:
 *     const amount = new BigNumber(5);
 * Original source: https://github.com/palantir/tslint/blob/42b058a6baa688f8be8558b277eb056c3ff79818/src/rules/noMagicNumbersRule.ts
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var allowedNumbers = this.ruleArguments.length > 0 ? this.ruleArguments : Rule.DEFAULT_ALLOWED;
        return this.applyWithWalker(
        // tslint:disable-next-line:no-inferred-empty-object-type
        new CustomNoMagicNumbersWalker(sourceFile, this.ruleName, new Set(allowedNumbers.map(String))));
    };
    Rule.ALLOWED_NODES = new Set([
        ts.SyntaxKind.ExportAssignment,
        ts.SyntaxKind.FirstAssignment,
        ts.SyntaxKind.LastAssignment,
        ts.SyntaxKind.PropertyAssignment,
        ts.SyntaxKind.ShorthandPropertyAssignment,
        ts.SyntaxKind.VariableDeclaration,
        ts.SyntaxKind.VariableDeclarationList,
        ts.SyntaxKind.EnumMember,
        ts.SyntaxKind.PropertyDeclaration,
        ts.SyntaxKind.Parameter,
    ]);
    Rule.DEFAULT_ALLOWED = [-1, 0, 1];
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// tslint:disable-next-line:max-classes-per-file
var CustomNoMagicNumbersWalker = /** @class */ (function (_super) {
    __extends(CustomNoMagicNumbersWalker, _super);
    function CustomNoMagicNumbersWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomNoMagicNumbersWalker._isNegativeNumberLiteral = function (node) {
        return (tsutils_1.isPrefixUnaryExpression(node) &&
            node.operator === ts.SyntaxKind.MinusToken &&
            node.operand.kind === ts.SyntaxKind.NumericLiteral);
    };
    CustomNoMagicNumbersWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return _this.checkNumericLiteral(node, node.text);
            }
            if (CustomNoMagicNumbersWalker._isNegativeNumberLiteral(node)) {
                return _this.checkNumericLiteral(node, "-" + node.operand.text);
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    // tslint:disable:no-non-null-assertion
    // tslint:disable-next-line:underscore-private-and-protected
    CustomNoMagicNumbersWalker.prototype.checkNumericLiteral = function (node, num) {
        if (!Rule.ALLOWED_NODES.has(node.parent.kind) && !this.options.has(num)) {
            if (node.parent.kind === ts.SyntaxKind.NewExpression) {
                var className = node.parent.expression.escapedText;
                var BIG_NUMBER_NEW_EXPRESSION = 'BigNumber';
                if (className === BIG_NUMBER_NEW_EXPRESSION) {
                    return; // noop
                }
            }
            this.addFailureAtNode(node, CustomNoMagicNumbersWalker.FAILURE_STRING);
        }
    };
    CustomNoMagicNumbersWalker.FAILURE_STRING = "'magic numbers' are not allowed";
    return CustomNoMagicNumbersWalker;
}(Lint.AbstractWalker));
// tslint:enable:no-unnecessary-type-assertion
//# sourceMappingURL=magicBigNumberRule.js.map