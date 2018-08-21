import {createSelector} from "reselect";
import {FeedState, State} from "../stateInterface";

const getFeed = (state: State): FeedState[] => state.feed;

export enum FeedType {
    Transactions = 1,
    Contracts = 2,
    Errors = 4,
    Accounts = 8,
    IPFSContent = 16
}

const FeedTypeLinks: any = {
    NEW_TRANSACTION: 1,
    NEW_CONTRACT: 2,
    NEW_ERROR: 4,
    NEW_ACCOUNT: 8,
    NEW_IPFS_CONTENT: 16
};

export const FeedFilterTransactions = createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
    return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & FeedType.Transactions))
});

export const FeedFilterContracts = createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
    return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & FeedType.Contracts))
});

export const FeedFilterErrors = createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
    return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & FeedType.Errors))
});

export const FeedFilterAccounts = createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
    return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & FeedType.Accounts))
});

export const FeedFilterIPFSContent = createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
    return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & FeedType.IPFSContent))
});

export const FeedFilter = (type: FeedType): any => {
    return createSelector(getFeed, (feed: FeedState[]): FeedState[] => {
        return feed.filter((elem: FeedState): boolean => !!((FeedTypeLinks[elem.action] ? FeedTypeLinks[elem.action] : -1) & type))
    });
};


