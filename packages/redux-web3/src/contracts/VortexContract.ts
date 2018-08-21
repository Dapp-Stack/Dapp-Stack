import ContractArtifact from 'truffle-contract-schema';
import * as sha1 from 'sha1';
import {Vortex} from "../vortex";
import {ContractCall, ContractSend} from "./contracts.actions";
import {TransactionArgumentState} from "../stateInterface";

const TransactionArgumentList = [
    "from",
    "to",
    "gas",
    "gasPrice",
    "value",
    "data",
    "nonce"
];

interface FetchedData {
    data: any,
    synced: boolean,
    error: any
}

interface SignatureCalls {
    [key: string]: FetchedData;
}

interface CachedWaitingCalls {
    [key: string]: boolean;
}

export class VortexContract {

    public static callSignature(...methodArguments: any[]): string {
        return (sha1(JSON.stringify({methodArguments})));
    }

    private _waiting_calls: CachedWaitingCalls = {};

    private getDataWithoutRefresh(methodName: string, ...methodArguments: any[]): any {

        let txArguments: TransactionArgumentState = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (let attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break ;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1] as TransactionArgumentState;
            methodArguments.pop()
        }

        const _this: any = this;
        const signature = VortexContract.callSignature(...methodArguments);
        const dispatch = Vortex.get().Store.dispatch;
        _this.vortexMethods = Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        if ((_this.vortexMethods[methodName])) {
            if (_this._waiting_calls[methodName + signature] || _this.vortexMethods[methodName].cache[signature]) {
                if (!_this.vortexMethods[methodName].cache[signature].disable_refresh)
                    _this.vortexMethods[methodName].cache[signature] = {synced: true, disable_refresh: false};
                if (this._waiting_calls[methodName + signature] && _this.vortexMethods[methodName].cache[signature])
                    this._waiting_calls[methodName + signature] = false;
                return (_this.vortexMethods[methodName].cache[signature].data);
            } else {
                _this.vortexMethods[methodName].cache[signature] = {synced: false, disable_refresh: true};
                dispatch(ContractCall(_this.artifact.name, _this.options.address, methodName, txArguments, undefined, ...methodArguments));
                this._waiting_calls[methodName + signature] = true;
            }
            return (_this.vortexMethods[methodName].cache[signature].data);
        }
        return (undefined);
    }

    private getData(methodName: string, ...methodArguments: any[]): any {

        let txArguments: TransactionArgumentState = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (let attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break ;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1] as TransactionArgumentState;
            methodArguments.pop()
        }

        const _this: any = this;
        const signature = VortexContract.callSignature(...methodArguments);
        const dispatch = Vortex.get().Store.dispatch;
        _this.vortexMethods = Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        if ((_this.vortexMethods[methodName])) {
            if (_this.vortexMethods[methodName].cache[signature]) {
                if (_this.vortexMethods[methodName].cache[signature].disable_refresh)
                    _this.vortexMethods[methodName].cache[signature] = {..._this.vortexMethods[methodName].cache[signature], disable_refresh: false};
                if (!_this.vortexMethods[methodName].cache[signature].synced && !this._waiting_calls[methodName + signature]) {
                    dispatch(ContractCall(_this.artifact.name, _this.options.address, methodName, txArguments, undefined, ...methodArguments));
                    this._waiting_calls[methodName + signature] = true;
                } else if (_this.vortexMethods[methodName].cache[signature].synced && this._waiting_calls[methodName + signature])
                    this._waiting_calls[methodName + signature] = false;
            } else {
                _this.vortexMethods[methodName].cache[signature] = {synced: false, disable_refresh: false};
                dispatch(ContractCall(_this.artifact.name, _this.options.address, methodName, txArguments, undefined, ...methodArguments));
                this._waiting_calls[methodName + signature] = true;
            }
            return (_this.vortexMethods[methodName].cache[signature].data);
        }
        return (undefined);
    }

    private vortexCall(methodName: string, methodAbiIndex: number, ...methodArguments: any[]): Promise<any> {

        let txArguments: TransactionArgumentState = {};
        if (methodArguments.length && typeof methodArguments[methodArguments.length - 1] === 'object') {
            for (let attribute_idx = 0; attribute_idx < Object.keys(methodArguments[methodArguments.length - 1]).length; ++attribute_idx) {
                if (TransactionArgumentList.indexOf(Object.keys(methodArguments[methodArguments.length - 1])[attribute_idx]) === -1) {
                    break ;
                }
            }
            txArguments = methodArguments[methodArguments.length - 1] as TransactionArgumentState;
            methodArguments.pop()
        }

        const _this: any = this;
        const _method_infos: any = _this._jsonInterface[methodAbiIndex];
        const _resolvers: any = {};
        const _ret: Promise<any> = new Promise<any>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
            _resolvers.success = ok;
            _resolvers.error = ko;
        });

        if (!Vortex.get()) {
            console.error("Vortex is not initialized");
            return (_ret);
        }

        _this.vortexMethods = Vortex.get().Store.getState().contracts[_this.artifact.name][_this._address.toLowerCase()].instance.vortexMethods;
        const dispatch = Vortex.get().Store.dispatch;

        const signature = VortexContract.callSignature(...methodArguments);

        if (_method_infos.constant) {
            if (_this.vortexMethods[methodName].cache[signature] === undefined) {
                _this.vortexMethods[methodName].cache[signature] = {};
                _this.vortexMethods[methodName].cache[signature].synced = false;
            }
            if (!_this.vortexMethods[methodName].cache[signature].synced) {
                dispatch(ContractCall(_this.artifact.name, _this.options.address, methodName, txArguments, _resolvers, ...methodArguments));
            } else {
                return (new Promise<string>((ok: (arg: any) => void, ko: (arg: any) => void): void => {
                    ok(_this.vortexMethods[methodName].cache[signature].data);
                }));
            }
        } else {
            dispatch(ContractSend(_this.artifact.name, _this.options.address, methodName, txArguments, _resolvers, ...methodArguments));
        }

        return (_ret);
    }

    constructor(artifact: ContractArtifact, address: string, coinbase: string, web3: any) {

        const contract_instance = new web3.eth.Contract(artifact.abi, address, {
            from: coinbase,
            data: artifact.bytecode
        });

        contract_instance.vortexMethods = {};

        Object.assign(this, contract_instance);
        const _this: any = this;

        _this.artifact = artifact;

        for (let abi_idx = 0; abi_idx < artifact.abi.length; ++ abi_idx) {
            if (artifact.abi[abi_idx].type === 'function') {
                _this.vortexMethods[artifact.abi[abi_idx].name] = {};
                if (artifact.abi[abi_idx].constant) {
                    _this.vortexMethods[artifact.abi[abi_idx].name].call = this.vortexCall.bind(this, artifact.abi[abi_idx].name, abi_idx);
                    _this.vortexMethods[artifact.abi[abi_idx].name].cache = {} as SignatureCalls;
                    _this.vortexMethods[artifact.abi[abi_idx].name].data = this.getData.bind(this, artifact.abi[abi_idx].name);
                    _this.vortexMethods[artifact.abi[abi_idx].name].constantData = this.getDataWithoutRefresh.bind(this, artifact.abi[abi_idx].name);
                } else {
                    _this.vortexMethods[artifact.abi[abi_idx].name].send = this.vortexCall.bind(this, artifact.abi[abi_idx].name, abi_idx);
                }
            }
        }

    }

}
