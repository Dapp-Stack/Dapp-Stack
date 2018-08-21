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
var _ = require("lodash");
var Lint = require("tslint");
var ts = require("typescript");
var VALID_BOOLEAN_PREFIXES = ['is', 'does', 'should', 'was', 'has', 'can', 'did', 'would', 'are'];
// tslint:disable:no-unnecessary-type-assertion
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    };
    Rule.FAILURE_STRING = "Boolean variable names should begin with: " + VALID_BOOLEAN_PREFIXES.join(', ');
    return Rule;
}(Lint.Rules.TypedRule));
exports.Rule = Rule;
function walk(ctx, tc) {
    traverse(ctx.sourceFile);
    function traverse(node) {
        checkNodeForViolations(ctx, node, tc);
        return ts.forEachChild(node, traverse);
    }
}
function checkNodeForViolations(ctx, node, tc) {
    switch (node.kind) {
        // Handle: const { timestamp } = ...
        case ts.SyntaxKind.BindingElement: {
            var bindingElementNode = node;
            if (bindingElementNode.name.kind === ts.SyntaxKind.Identifier) {
                handleBooleanNaming(bindingElementNode, tc, ctx);
            }
            break;
        }
        // Handle regular assignments: const block = ...
        case ts.SyntaxKind.VariableDeclaration:
            var variableDeclarationNode = node;
            if (variableDeclarationNode.name.kind === ts.SyntaxKind.Identifier) {
                handleBooleanNaming(node, tc, ctx);
            }
            break;
        default:
            _.noop();
    }
}
function handleBooleanNaming(node, tc, ctx) {
    var nodeName = node.name;
    var variableName = nodeName.getText();
    var lowercasedName = _.toLower(variableName);
    var typeNode = tc.getTypeAtLocation(node);
    var typeName = typeNode.intrinsicName;
    if (typeName === 'boolean') {
        var hasProperName = !_.isUndefined(_.find(VALID_BOOLEAN_PREFIXES, function (prefix) {
            return _.startsWith(lowercasedName, prefix);
        }));
        if (!hasProperName) {
            ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
        }
    }
}
// tslint:enable:no-unnecessary-type-assertion
//# sourceMappingURL=booleanNameRule.js.map