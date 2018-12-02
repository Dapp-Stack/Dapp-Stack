export type Maybe<T> = false | T

export type EthereumNetwork =
  | 'homestead'
  | 'rinkeby'
  | 'ropsten'
  | 'kovan'
  | 'dev'
  | 'external'

export type WebFramework = 'create-react-app' | 'angular' | 'vue' | 'test'
export type WebDeploy = 'ipfs'

export type Web = {
  framework: Maybe<WebFramework>
  deploy: Maybe<WebDeploy>
}

export type Ethereum = {
  network: EthereumNetwork
  apiKey?: string
  mnemonic?: string
  migrate: (deployer: any) => Promise<void>
}

export interface Compile {
  contracts: string[]
}

export interface Environment {
  ethereum: Maybe<Ethereum>
  ipfs: boolean
  web: Web
  compile: Compile
}
