"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forge_1 = require("./forge");
var web3_actions_1 = require("./web3/web3.actions");
var contracts_actions_1 = require("./contracts/contracts.actions");
var accounts_actions_1 = require("./accounts/accounts.actions");
var event_actions_1 = require("./event/event.actions");
var ipfs_actions_1 = require("./ipfs/ipfs.actions");
var Vortex = /** @class */ (function () {
    /**
     * Instantiate a new Vorte instance.
     * Accessing VortexInstance will give access to the last instanciated Vortex.
     *
     * @param {ContractConfig} contracts Truffle or Embark Contracts configuration.
     * @param loader Promise that returns a web3 instance ready to be used.
     * @param {GeneratorConfig<T>} config Configuration arguments for the store generator.
     */
    function Vortex(contracts, loader, config) {
        if (config === void 0) { config = undefined; }
        this._web3_loader = undefined;
        this._contracts = undefined;
        this._config = {};
        this._store = undefined;
        this._network_ids = [];
        this._contracts = contracts;
        this._web3_loader = loader;
        this._config = config || {};
    }
    Vortex.factory = function (contracts, loader, config) {
        if (config === void 0) { config = undefined; }
        return (Vortex._instance || (Vortex._instance = new Vortex(contracts, loader, config)));
    };
    Vortex.get = function () {
        return Vortex._instance;
    };
    /**
     * Run the Vortex Redux Store.
     */
    Vortex.prototype.run = function () {
        if (this._contracts) {
            if (this._contracts.type === 'truffle' && this._contracts.network_contracts) {
                for (var idx = 0; idx < this._contracts.network_contracts.length; ++idx) {
                    this.networksOf(this._contracts.network_contracts[idx]);
                }
            }
            this._store = forge_1.forge(this._contracts, this._config);
        }
        else {
            throw new Error("No Contracts Given");
        }
    };
    /**
     * Load Web3 instance from given source.
     * @param {Promise<any>} source The source that returns an instance when resolved.
     */
    Vortex.prototype.loadWeb3 = function () {
        if (this._store) {
            this._store.dispatch(web3_actions_1.Web3Load(this._web3_loader, this._network_ids));
        }
        else {
            throw new Error("Call run before.");
        }
    };
    /**
     * Add a new contract in contract list.
     *
     * @param {} contract Contract to add.
     */
    Vortex.prototype.addContract = function (contract) {
        if (this._contracts === undefined) {
            throw new Error("Invalid Contracts !");
        }
        switch (this._contracts.type) {
            case 'truffle':
                this._contracts.truffle_contracts.push(contract);
                break;
            case 'embark':
                // TODO Fix this
                this._contracts.embark_contracts.push(contract);
                break;
            case 'manual':
                // TODO Fix this
                break;
            default:
                throw new Error("Invalid Contracts !");
        }
    };
    /**
     * Adds a new Event to subscription pool.
     *
     * @param {string} event_name Name of the event you want to subscribe to.
     * @param {string} contract_name Name of the contract where the event is triggered.
     * @param {string} contract_address Address of contract instance.
     * @param {string} args Additional arguments for Events
     */
    Vortex.prototype.subscribeEvent = function (event_name, contract_name, contract_address) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (this._store) {
            this._store.dispatch(event_actions_1.EventAdd(contract_name, contract_address, event_name, args));
        }
        else {
            throw new Error("Call run before.");
        }
    };
    /**
     * Adds a network id to whitelist.
     *
     * @param {number} network_id Network Id to add.
     */
    Vortex.prototype.addNetwork = function (network_id) {
        this._network_ids.push(network_id);
    };
    /**
     *  Takes a Truffle Contract Artifact and extracts all network ids where Contract has instances, adds them to whitelist
     *  If you are using Embark, Network checks will be done depending on your chains.json.
     *
     * @param {any} contract A Truffle Contract Artifact
     */
    Vortex.prototype.networksOf = function (contract) {
        this._network_ids = this._network_ids.concat(Object.keys(contract.networks).map(function (val) { return parseInt(val); }));
    };
    /**
     * Add a new reducer in the Reducer Map.
     *
     * @param {string} field Field Name associated with reducer.
     * @param {Reducer<any, any>} reducer Reducer
     */
    Vortex.prototype.addReducer = function (field, reducer) {
        if (this._config.reducer === undefined) {
            this._config.reducer = {};
        }
        this._config.reducer[field] = reducer;
    };
    /**
     * Custom Initial State, useful when adding custom properties.
     *
     * @param {DeepPartial<T extends State>} customState
     */
    Vortex.prototype.setCustomState = function (customState) {
        this._config.custom_state = customState;
    };
    /**
     * Load a new instance of a Smart Contract. Expect a new Feed element and
     * the contracts section to get updated.
     *
     * @param {string} contractName
     * @param {string} contractAddress
     */
    Vortex.prototype.loadContract = function (contractName, contractAddress) {
        if (this._store) {
            this._store.dispatch(contracts_actions_1.ContractLoad(contractName, contractAddress));
        }
        else {
            throw new Error("Call run before.");
        }
    };
    /**
     * Load the given IPFS hash into the store.
     *
     * @param {string} hash The IPFS Hash you want to load
     */
    Vortex.prototype.fetchIPFSHash = function (hash) {
        if (this._store) {
            this._store.dispatch(ipfs_actions_1.IPFSLoad(hash));
        }
        else {
            throw new Error("Call run before.");
        }
    };
    /**
     * Add a new contract to fetch pool.
     *
     * @param {string} address Address to fetch
     */
    Vortex.prototype.subscribeAccount = function (address) {
        if (this._store) {
            this._store.dispatch(accounts_actions_1.AccountAdd(address));
        }
        else {
            throw new Error("Call run before.");
        }
    };
    Object.defineProperty(Vortex.prototype, "Contracts", {
        /**
         * Contracts getter
         *
         * @returns {ContractConfig} Array of loaded artifacts.
         */
        get: function () {
            return (this._contracts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vortex.prototype, "Store", {
        /**
         * Store getter
         *
         * @returns {Store<T extends State>} Instance of Store
         */
        get: function () {
            if (!this._store)
                throw new Error("Call run before");
            return (this._store);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vortex.prototype, "Networks", {
        /**
         * Network Id Whitelist getter.
         *
         * @returns {number[]} List of whitelisted network ids.
         */
        get: function () {
            return (this._network_ids);
        },
        enumerable: true,
        configurable: true
    });
    Vortex._instance = undefined;
    return Vortex;
}());
exports.Vortex = Vortex;
//# sourceMappingURL=vortex.js.map