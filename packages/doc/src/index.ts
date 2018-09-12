const fs = require('fs-extra');
const parser = require('solidity-parser-antlr');
const sha1File = require('sha1-file');

const generateDoc = async function (contractName) {
  const outfile = `${__dirname}/../doc/${contractName}`.replace('.sol', '.md');
  const file = `${__dirname}/../src/${contractName}`;
  console.log(`[Contracts] Starting to generate documentation of ${contractName}`);
  await fs.ensureFile(outfile);
  let filesTable = `
|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
`;

  let contractsTable = `
|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
`;

  filesTable += `| ${file} | ${sha1File(file)} |
`;

  const content = fs.readFileSync(file).toString('utf-8');
  const ast = parser.parse(content);

  parser.visit(ast, {
    ContractDefinition(node) {
      const name = node.name;
      const bases = node.baseContracts
        .map(spec => {
          return spec.baseName.namePath;
        })
        .join(', ');

      let specs = '';
      if (node.kind === 'library') {
        specs += 'Library';
      } else if (node.kind === 'interface') {
        specs += 'Interface';
      } else {
        specs += 'Implementation';
      }

      contractsTable += `||||||
| **${name}** | ${specs} | ${bases} |||
`;
    },

    FunctionDefinition(node) {
      let name;

      if (node.isConstructor) {
        name = '\\<Constructor\\>';
      } else if (!node.name) {
        name = '\\<Fallback\\>';
      } else {
        name = node.name;
      }

      let spec = '';
      if (node.visibility === 'public' || node.visibility === 'default') {
        spec += 'Public ❗️';
      } else if (node.visibility === 'external') {
        spec += 'External ❗️';
      } else if (node.visibility === 'private') {
        spec += 'Private 🔐';
      } else if (node.visibility === 'internal') {
        spec += 'Internal 🔒';
      }

      let payable = '';
      if (node.stateMutability === 'payable') {
        payable = '💵';
      }

      let mutating = '';
      if (!node.stateMutability) {
        mutating = '🛑';
      }

      contractsTable += `| └ | ${name} | ${spec} | ${mutating} ${payable} |`;
    },

    'FunctionDefinition:exit'(node) {
      contractsTable += ` |
`;
    },

    ModifierInvocation(node) {
      contractsTable += ` ${node.name}`;
    },
  });

  const reportContents = `## Sūrya's Description Report
### Files Description Table
${filesTable}
### Contracts Description Table
${contractsTable}
### Legend
|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
`;

  try {
    fs.writeFileSync(outfile, reportContents, { flag: 'w' });
    console.log(`[Contracts] Finished to generate documentation of ${contractName}`);
  } catch {
    console.log(`[Contracts] Error while generating documentation of ${contractName}`);
  }
};

module.exports = {
  generateDoc,
};
