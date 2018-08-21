import ContractArtifact from 'truffle-contract-schema';
export declare class VortexContract {
    static callSignature(...methodArguments: any[]): string;
    private _waiting_calls;
    private getDataWithoutRefresh;
    private getData;
    private vortexCall;
    constructor(artifact: ContractArtifact, address: string, coinbase: string, web3: any);
}
