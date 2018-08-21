import ContractArtifact from 'truffle-contract-schema';
import {DeepPartial, Reducer, ReducersMapObject, Store} from "redux";
import {State} from "./stateInterface";
import {EmbarkContracts, forge, GeneratorConfig, ManualContracts, TruffleContracts} from "./forge";
import {Web3Load} from "./web3/web3.actions";
import {ContractLoad} from "./contracts/contracts.actions";
import {AccountAdd} from "./accounts/accounts.actions";
import {EventAdd} from "./event/event.actions";
import {IPFSLoad} from "./ipfs/ipfs.actions";

/**
 * This interface is only here to merge all configuration types into one interface. Have a look at each configuration
 * separately ! For Embark users => {@link EmbarkContracts}, for Truffle ones => {@link TruffleContracts}, and for
 * users that use no frameworks {@link ManualContracts}.
 */
interface ContractConfig extends EmbarkContracts, TruffleContracts, ManualContracts {}

export class Vortex<T extends State> {

    private readonly _web3_loader: Promise<any> = undefined;

    private _contracts: ContractConfig = undefined;

    private _config: GeneratorConfig<T> = {};

    private _store: Store<T> = undefined;

    private _network_ids: number[] = [] as number[];

    private static _instance: Vortex<any> = undefined;

    public static factory<U extends State = State>(contracts: ContractConfig, loader: Promise<any>, config: GeneratorConfig<U> = undefined): Vortex<U> {
        return (Vortex._instance || (Vortex._instance = new Vortex<U>(contracts, loader, config)));
    }

    public static get<U extends State = State>(): Vortex<U> {
        return Vortex._instance;
    }

    /**
     * Instantiate a new Vorte instance.
     * Accessing VortexInstance will give access to the last instanciated Vortex.
     *
     * @param {ContractConfig} contracts Truffle or Embark Contracts configuration.
     * @param loader Promise that returns a web3 instance ready to be used.
     * @param {GeneratorConfig<T>} config Configuration arguments for the store generator.
     */
    constructor(contracts: ContractConfig, loader: Promise<any>, config: GeneratorConfig<T> = undefined) {
        this._contracts = contracts;
        this._web3_loader = loader;
        this._config = config || {};
    }

    /**
     * Run the Vortex Redux Store.
     */
    public run(): void {
        if (this._contracts) {
            if (this._contracts.type === 'truffle' && this._contracts.network_contracts) {
                for (let idx = 0; idx < this._contracts.network_contracts.length; ++idx) {
                    this.networksOf(this._contracts.network_contracts[idx]);
                }
            }
            this._store = forge(this._contracts, this._config);
        } else {
            throw new Error("No Contracts Given");
        }
    }

    /**
     * Load Web3 instance from given source.
     * @param {Promise<any>} source The source that returns an instance when resolved.
     */
    public loadWeb3(): void {
        if (this._store) {
            this._store.dispatch(Web3Load(this._web3_loader, this._network_ids));
        } else {
            throw new Error("Call run before.");
        }
    }

    /**
     * Add a new contract in contract list.
     *
     * @param {} contract Contract to add.
     */
    public addContract(contract: any): void {
        if (this._contracts === undefined) {
            throw new Error("Invalid Contracts !");
        }
        switch (this._contracts.type) {
            case 'truffle':
                this._contracts.truffle_contracts.push(contract);
                break ;
            case 'embark':
                // TODO Fix this
                this._contracts.embark_contracts.push(contract);
                break ;
            case 'manual':
                // TODO Fix this
                break ;
            default:
                throw new Error("Invalid Contracts !");
        }
    }

    /**
     * Adds a new Event to subscription pool.
     *
     * @param {string} event_name Name of the event you want to subscribe to.
     * @param {string} contract_name Name of the contract where the event is triggered.
     * @param {string} contract_address Address of contract instance.
     * @param {string} args Additional arguments for Events
     */
    public subscribeEvent(event_name: string, contract_name: string, contract_address: string, ...args: string[]): void {
        if (this._store) {
            this._store.dispatch(EventAdd(contract_name, contract_address, event_name, args));
        } else {
            throw new Error("Call run before.");
        }
    }

    /**
     * Adds a network id to whitelist.
     *
     * @param {number} network_id Network Id to add.
     */
    public addNetwork(network_id: number): void {
        this._network_ids.push(network_id);
    }

    /**
     *  Takes a Truffle Contract Artifact and extracts all network ids where Contract has instances, adds them to whitelist
     *  If you are using Embark, Network checks will be done depending on your chains.json.
     *
     * @param {any} contract A Truffle Contract Artifact
     */
    public networksOf(contract: ContractArtifact): void {
        this._network_ids = this._network_ids.concat(Object.keys(contract.networks).map((val: string) => parseInt(val)));
    }

    /**
     * Add a new reducer in the Reducer Map.
     *
     * @param {string} field Field Name associated with reducer.
     * @param {Reducer<any, any>} reducer Reducer
     */
    public addReducer(field: string, reducer: Reducer<any, any>): void {
        if (this._config.reducer === undefined) {
            this._config.reducer = {} as ReducersMapObject<T>;
        }
        this._config.reducer[field] = reducer;
    }

    /**
     * Custom Initial State, useful when adding custom properties.
     *
     * @param {DeepPartial<T extends State>} customState
     */
    public setCustomState(customState: DeepPartial<T>): void {
        this._config.custom_state = customState;
    }

    /**
     * Load a new instance of a Smart Contract. Expect a new Feed element and
     * the contracts section to get updated.
     *
     * @param {string} contractName
     * @param {string} contractAddress
     */
    public loadContract(contractName: string, contractAddress: string): void {
        if (this._store) {
            this._store.dispatch(ContractLoad(contractName, contractAddress));
        } else {
            throw new Error("Call run before.");
        }
    }

    /**
     * Load the given IPFS hash into the store.
     *
     * @param {string} hash The IPFS Hash you want to load
     */
    public fetchIPFSHash(hash: string): void {
        if (this._store) {
            this._store.dispatch(IPFSLoad(hash));
        } else {
            throw new Error("Call run before.");
        }
    }

    /**
     * Add a new contract to fetch pool.
     *
     * @param {string} address Address to fetch
     */
    public subscribeAccount(address: string): void {
        if (this._store) {
            this._store.dispatch(AccountAdd(address));
        } else {
            throw new Error("Call run before.");
        }
    }

    /**
     * Contracts getter
     *
     * @returns {ContractConfig} Array of loaded artifacts.
     */
    public get Contracts(): ContractConfig {
        return (this._contracts);
    }

    /**
     * Store getter
     *
     * @returns {Store<T extends State>} Instance of Store
     */
    public get Store(): Store<T> {
        if (!this._store)
            throw new Error("Call run before");
        return (this._store);
    }

    /**
     * Network Id Whitelist getter.
     *
     * @returns {number[]} List of whitelisted network ids.
     */
    public get Networks(): number[] {
        return (this._network_ids);
    }
}
