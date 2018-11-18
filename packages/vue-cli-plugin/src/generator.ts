module.exports = (api: any, options: any, rootOptions: any) => {
  api.extendPackage({
    scripts: {
      start: 'solon-scripts start',
    },
  });

  api.render('../../../template');
};
