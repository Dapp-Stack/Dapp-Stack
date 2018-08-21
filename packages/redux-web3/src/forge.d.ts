import { Store, DeepPartial, ReducersMapObject } from "redux";
import { BacklinkConfigState, State } from './stateInterface';
import TruffleArtifact from 'truffle-contract-schema';
export interface IPFSConfig {
    host: string;
    port: string;
    options?: any;
}
export interface BacklinkConfig extends BacklinkConfigState {
}
export interface GeneratorConfig<T> {
    reducer?: ReducersMapObject<T>;
    custom_state?: DeepPartial<T>;
    account_refresh_rate?: number;
    custom_sagas?: any[];
    ipfs_config?: IPFSConfig;
    backlink_config?: BacklinkConfig;
}
export interface Contracts {
    type: string;
}
export interface EmbarkContracts extends Contracts {
    chains?: any;
    embark_contracts?: any;
    preloaded_contracts?: string[];
}
export interface TruffleContracts extends Contracts {
    truffle_contracts?: TruffleArtifact[];
    preloaded_contracts?: string[];
    network_contracts?: TruffleArtifact[];
}
export interface ManualContractArtifact {
    abi: any;
    at?: string;
    deployed_bytecode?: string;
}
export interface ManualContractArtifactMap {
    [key: string]: ManualContractArtifact;
}
export interface ManualContracts extends Contracts {
    manual_contracts?: ManualContractArtifactMap;
}
export declare function forge<T extends State = State>(contracts: EmbarkContracts | TruffleContracts | ManualContracts, config?: GeneratorConfig<T>): Store;
