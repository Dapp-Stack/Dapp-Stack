import {Action} from "redux";

export interface FeedNewTransactionAction extends Action {
    txHash: string;
}

export function FeedNewTransaction(txHash: string): FeedNewTransactionAction {
    return ({
        type: 'FEED_NEW_TRANSACTION',
        txHash
    });
}

export interface FeedNewContractAction extends Action {
    contractName: string,
    address: string
}

export function FeedNewContract(contractName: string, address: string): FeedNewContractAction {
    return ({
        type: 'FEED_NEW_CONTRACT',
        contractName,
        address
    });
}

export interface FeedNewErrorAction extends Action {
    reason: any,
    message: string,
    when: string
}

export function FeedNewError(reason: any, message: string, when: string): FeedNewErrorAction {
    return {
        type: 'FEED_NEW_ERROR',
        reason,
        message,
        when
    } as FeedNewErrorAction;
}

export interface FeedNewAccountAction extends Action {
    account: string,
    coinbase: boolean
}

export function FeedNewAccount(account: string, coinbase: boolean): FeedNewAccountAction {
    return {
        type: 'FEED_NEW_ACCOUNT',
        account,
        coinbase
    } as FeedNewAccountAction;
}

export interface FeedNewIPFSContentAction extends Action {
    ipfs_hash: string
}

export function FeedNewIPFSContent(ipfs_hash: string): FeedNewIPFSContentAction {
    return {
        type: 'FEED_NEW_IPFS_CONTENT',
        ipfs_hash
    } as FeedNewIPFSContentAction;
}

export type FeedActions = FeedNewContractAction | FeedNewTransactionAction | FeedNewErrorAction | FeedNewAccountAction | FeedNewIPFSContentAction;
