import { State } from "../stateInterface";
export declare enum FeedType {
    Transactions = 1,
    Contracts = 2,
    Errors = 4,
    Accounts = 8,
    IPFSContent = 16
}
export declare const FeedFilterTransactions: import("../../../../node_modules/reselect/lib/index").OutputSelector<State, (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[], (res: (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]) => (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]>;
export declare const FeedFilterContracts: import("../../../../node_modules/reselect/lib/index").OutputSelector<State, (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[], (res: (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]) => (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]>;
export declare const FeedFilterErrors: import("../../../../node_modules/reselect/lib/index").OutputSelector<State, (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[], (res: (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]) => (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]>;
export declare const FeedFilterAccounts: import("../../../../node_modules/reselect/lib/index").OutputSelector<State, (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[], (res: (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]) => (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]>;
export declare const FeedFilterIPFSContent: import("../../../../node_modules/reselect/lib/index").OutputSelector<State, (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[], (res: (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]) => (import("../stateInterface").FeedNewContractState | import("../stateInterface").FeedNewTransactionState | import("../stateInterface").FeedNewIPFSContentState | import("../stateInterface").FeedNewErrorState | import("../stateInterface").FeedNewAccountState)[]>;
export declare const FeedFilter: (type: FeedType) => any;
