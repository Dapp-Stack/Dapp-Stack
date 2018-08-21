import ContractArtifact from 'truffle-contract-schema';
import { DeepPartial, Reducer, Store } from "redux";
import { State } from "./stateInterface";
import { EmbarkContracts, GeneratorConfig, ManualContracts, TruffleContracts } from "./forge";
/**
 * This interface is only here to merge all configuration types into one interface. Have a look at each configuration
 * separately ! For Embark users => {@link EmbarkContracts}, for Truffle ones => {@link TruffleContracts}, and for
 * users that use no frameworks {@link ManualContracts}.
 */
interface ContractConfig extends EmbarkContracts, TruffleContracts, ManualContracts {
}
export declare class Vortex<T extends State> {
    private readonly _web3_loader;
    private _contracts;
    private _config;
    private _store;
    private _network_ids;
    private static _instance;
    static factory<U extends State = State>(contracts: ContractConfig, loader: Promise<any>, config?: GeneratorConfig<U>): Vortex<U>;
    static get<U extends State = State>(): Vortex<U>;
    /**
     * Instantiate a new Vorte instance.
     * Accessing VortexInstance will give access to the last instanciated Vortex.
     *
     * @param {ContractConfig} contracts Truffle or Embark Contracts configuration.
     * @param loader Promise that returns a web3 instance ready to be used.
     * @param {GeneratorConfig<T>} config Configuration arguments for the store generator.
     */
    constructor(contracts: ContractConfig, loader: Promise<any>, config?: GeneratorConfig<T>);
    /**
     * Run the Vortex Redux Store.
     */
    run(): void;
    /**
     * Load Web3 instance from given source.
     * @param {Promise<any>} source The source that returns an instance when resolved.
     */
    loadWeb3(): void;
    /**
     * Add a new contract in contract list.
     *
     * @param {} contract Contract to add.
     */
    addContract(contract: any): void;
    /**
     * Adds a new Event to subscription pool.
     *
     * @param {string} event_name Name of the event you want to subscribe to.
     * @param {string} contract_name Name of the contract where the event is triggered.
     * @param {string} contract_address Address of contract instance.
     * @param {string} args Additional arguments for Events
     */
    subscribeEvent(event_name: string, contract_name: string, contract_address: string, ...args: string[]): void;
    /**
     * Adds a network id to whitelist.
     *
     * @param {number} network_id Network Id to add.
     */
    addNetwork(network_id: number): void;
    /**
     *  Takes a Truffle Contract Artifact and extracts all network ids where Contract has instances, adds them to whitelist
     *  If you are using Embark, Network checks will be done depending on your chains.json.
     *
     * @param {any} contract A Truffle Contract Artifact
     */
    networksOf(contract: ContractArtifact): void;
    /**
     * Add a new reducer in the Reducer Map.
     *
     * @param {string} field Field Name associated with reducer.
     * @param {Reducer<any, any>} reducer Reducer
     */
    addReducer(field: string, reducer: Reducer<any, any>): void;
    /**
     * Custom Initial State, useful when adding custom properties.
     *
     * @param {DeepPartial<T extends State>} customState
     */
    setCustomState(customState: DeepPartial<T>): void;
    /**
     * Load a new instance of a Smart Contract. Expect a new Feed element and
     * the contracts section to get updated.
     *
     * @param {string} contractName
     * @param {string} contractAddress
     */
    loadContract(contractName: string, contractAddress: string): void;
    /**
     * Load the given IPFS hash into the store.
     *
     * @param {string} hash The IPFS Hash you want to load
     */
    fetchIPFSHash(hash: string): void;
    /**
     * Add a new contract to fetch pool.
     *
     * @param {string} address Address to fetch
     */
    subscribeAccount(address: string): void;
    /**
     * Contracts getter
     *
     * @returns {ContractConfig} Array of loaded artifacts.
     */
    readonly Contracts: ContractConfig;
    /**
     * Store getter
     *
     * @returns {Store<T extends State>} Instance of Store
     */
    readonly Store: Store<T>;
    /**
     * Network Id Whitelist getter.
     *
     * @returns {number[]} List of whitelisted network ids.
     */
    readonly Networks: number[];
}
export {};
