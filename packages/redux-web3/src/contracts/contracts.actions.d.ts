import { Action } from 'redux';
import { TransactionArgumentState } from "../stateInterface";
export interface ContractLoadingAction extends Action {
    contractName: string;
    contractAddress: string;
}
export declare function ContractLoading(contractName: string, contractAddress: string): ContractLoadingAction;
export interface ContractLoadedAction extends Action {
    contractName: string;
    contractAddress: string;
    contractInstance: any;
}
export declare function ContractLoaded(contractName: string, contractAddress: string, contractInstance: any): ContractLoadedAction;
export interface ContractErrorAction extends Action {
    contractName: string;
    contractAddress: string;
    error: any;
}
export declare function ContractError(contractName: string, contractAddress: string, error: any): ContractErrorAction;
export interface ContractSendAction extends Action {
    contractName: string;
    contractAddress: string;
    methodName: string;
    transactionArgs: TransactionArgumentState;
    resolvers: any;
    methodArgs: any;
}
export declare function ContractSend(contractName: string, contractAddress: string, methodName: string, transactionArgs: TransactionArgumentState, resolvers: any, ...methodArgs: any[]): ContractSendAction;
export declare type ContractCallAction = ContractSendAction;
export declare function ContractCall(contractName: string, contractAddress: string, methodName: string, transactionArgs: TransactionArgumentState, resolvers: any, ...methodArgs: any[]): ContractCallAction;
export interface ContractVarReceivedAction extends Action {
    contractName: string;
    contractAddress: string;
    methodName: string;
    methodHash: string;
    result: any;
}
export declare function ContractVarReceived(contractName: string, contractAddress: string, methodName: string, methodHash: string, result: any): ContractVarReceivedAction;
export interface ContractVarErrorReceivedAction extends Action {
    contractName: string;
    contractAddress: string;
    methodName: string;
    methodHash: string;
    error: any;
}
export declare function ContractVarErrorReceived(contractName: string, contractAddress: string, methodName: string, methodHash: string, error: any): ContractVarErrorReceivedAction;
export interface ContractVarForceRefreshAction extends Action {
    contractName: string;
    contractAddress: string;
    methodName: string;
    methodHash: string;
}
export declare function ContractVarForceRefresh(contractName: string, contractAddress: string, methodName: string, methodHash: string): ContractVarForceRefreshAction;
export interface ContractLoadAction extends Action {
    contractName: string;
    contractAddress: string;
}
export declare function ContractLoad(contractName: string, contractAddress: string): ContractLoadAction;
export interface ContractLoadInfos {
    name: string;
    address: string;
}
export interface ContractPreloadDoneAction extends Action {
    recap: ContractLoadInfos[];
}
export declare function ContractPreloadDone(recap: ContractLoadInfos[]): ContractPreloadDoneAction;
export interface ContractCompleteRefreshAction extends Action {
    contract_name: string;
    contract_address: string;
}
export declare function ContractCompleteRefresh(contract_name: string, contract_address: string): ContractCompleteRefreshAction;
export interface ContractSetDeployedAction extends Action {
    contract_name: string;
    contract_address: string;
}
export declare function ContractSetDeployed(contract_name: string, contract_address: string): ContractSetDeployedAction;
export declare type ContractActions = ContractLoadingAction | ContractLoadedAction | ContractErrorAction | ContractCallAction | ContractSendAction | ContractVarReceivedAction | ContractVarErrorReceivedAction | ContractVarForceRefreshAction | ContractSetDeployedAction;
