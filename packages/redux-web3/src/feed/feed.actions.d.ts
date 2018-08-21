import { Action } from "redux";
export interface FeedNewTransactionAction extends Action {
    txHash: string;
}
export declare function FeedNewTransaction(txHash: string): FeedNewTransactionAction;
export interface FeedNewContractAction extends Action {
    contractName: string;
    address: string;
}
export declare function FeedNewContract(contractName: string, address: string): FeedNewContractAction;
export interface FeedNewErrorAction extends Action {
    reason: any;
    message: string;
    when: string;
}
export declare function FeedNewError(reason: any, message: string, when: string): FeedNewErrorAction;
export interface FeedNewAccountAction extends Action {
    account: string;
    coinbase: boolean;
}
export declare function FeedNewAccount(account: string, coinbase: boolean): FeedNewAccountAction;
export interface FeedNewIPFSContentAction extends Action {
    ipfs_hash: string;
}
export declare function FeedNewIPFSContent(ipfs_hash: string): FeedNewIPFSContentAction;
export declare type FeedActions = FeedNewContractAction | FeedNewTransactionAction | FeedNewErrorAction | FeedNewAccountAction | FeedNewIPFSContentAction;
