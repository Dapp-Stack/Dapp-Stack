export const globalError = (error: Error) => {
  console.error('An unexpected error happened and caused solon to failed, please create an issue at: ');
  console.error('https://github.com/SolonProject/solon/issues/new?labels=&template=bug_report.md');
  console.error(error);
  process.exit(1);
};
