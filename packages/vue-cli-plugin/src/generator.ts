module.exports = (api: any, options: any, rootOptions: any) => {
  api.extendPackage({
    scripts: {
      das: 'dapp-stack-scripts',
    },
  });

  api.render('../../../template');
};
