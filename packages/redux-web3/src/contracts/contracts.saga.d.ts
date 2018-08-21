import { State } from "../stateInterface";
export declare function runForceRefreshRoundOn(state: State, emit: (arg?: any) => void, contractName: string, instance_address: string): void;
export declare function runForceRefreshRound(state: State, emit: (arg?: any) => void): void;
export declare function ContractSagas(dispatch: (arg: any) => void): any;
