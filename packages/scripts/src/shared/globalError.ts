export const globalError = (error: Error) => {
  console.error(
    'An unexpected error happened and caused DApp Stack to failed, please create an issue at: '
  )
  console.error(
    'https://github.com/Dapp-Stack/Dapp-Stack/issues/new?labels=&template=bug_report.md'
  )
  console.error(error)
  process.exit(1)
}
