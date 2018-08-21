import {Reducer} from "redux";
import {FeedState} from "../stateInterface";
import {
    FeedActions,
    FeedNewAccountAction,
    FeedNewContractAction,
    FeedNewErrorAction, FeedNewIPFSContentAction,
    FeedNewTransactionAction
} from "./feed.actions";

export const feed : Reducer<FeedState[], FeedActions> = (state: FeedState[] = [] as FeedState[], action: FeedActions): FeedState[] => {

    switch (action.type) {

        case 'FEED_NEW_TRANSACTION':
            state.push({
                action: 'NEW_TRANSACTION',
                transaction_hash: (<FeedNewTransactionAction>action).txHash,
                timestamp: Date.now()
            });
            return [
                ...state
            ];

        case 'FEED_NEW_CONTRACT':
            state.push({
                action: 'NEW_CONTRACT',
                contract_name: (<FeedNewContractAction>action).contractName,
                contract_address: (<FeedNewContractAction>action).address,
                timestamp: Date.now()
            });
            return [
                ...state
            ];

        case 'FEED_NEW_ERROR':
            console.warn("[Feed Error]: " + (<FeedNewErrorAction>action).message + " => " + (<FeedNewErrorAction>action).when);
            state.push({
                action: 'NEW_ERROR',
                error: {
                    reason: (<FeedNewErrorAction>action).reason,
                    message: (<FeedNewErrorAction>action).message,
                    when: (<FeedNewErrorAction>action).when
                },
                timestamp: Date.now()
            });
            return [
                ...state
            ];

        case 'FEED_NEW_ACCOUNT':
            state.push({
                action: 'NEW_ACCOUNT',
                account: (<FeedNewAccountAction>action).account,
                coinbase: (<FeedNewAccountAction>action).coinbase,
                timestamp: Date.now()
            });
            return [
                ...state
            ];

        case 'FEED_NEW_IPFS_CONTENT':
            state.push({
                action: 'NEW_IPFS_CONTENT',
                ipfs_hash: (<FeedNewIPFSContentAction>action).ipfs_hash,
                timestamp: Date.now()
            });
            return [
                ...state
            ];

        default:
            return state;
    }
};
