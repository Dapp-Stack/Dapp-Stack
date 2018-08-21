import {Web3LoadAction} from "./web3/web3.actions";

declare var describe: any;
declare var test: any;
declare var expect: any;

import {forge, GeneratorConfig} from './forge';
import * as Migrations from '../../setup/truffle/build/contracts/Migrations.json';
import {Reducer, Action, DeepPartial, ReducersMapObject} from "redux";
import {State} from "./stateInterface";
import {dummyReducer} from "./dummyReducer";
import * as Web3 from "web3";

let store;
let _web3;
const getWeb3: Promise<any> = new Promise<any>((ok: (arg?: any) => void, ko: (arg?: any) => void): void => {
    try {
        _web3 = new (<any>Web3)(new (<any>Web3).providers.HttpProvider("http://localhost:8546"));
        ok(_web3);
    } catch (e) {
        ko(e);
    }
});

describe("forge", () => {

    describe("Normal State", () => {
        test("Instanciate with Normal State", () => {


            store = forge({
                type: 'truffle',
                truffle_contracts: [Migrations],
                preloaded_contracts: ["Migrations"]
            });
            let state: State = store.getState();
            expect(state.web3.status).toBe("LOADING");
        });

        test("Load dummy web3", (done: (err?: any) => void) => {

            store.subscribe(() => {
                if (store.getState().web3 && store.getState().web3._)
                    done();
            });

            store.dispatch({
                type: 'LOAD_WEB3',
                loader: getWeb3,
                networks: []
            } as Web3LoadAction);

        }, 10000)
    });

    describe("Extended State", () => {
        test("Instanciate with extended State and custom Reducers", () => {

            interface testAction extends Action {
                testProperty: number;
            }

            interface testState extends State {
                testStateProperty: number
            }

            let dummyreducer: Reducer<number, testAction> = (state: number = 0, action: testAction): number => {
                return state;
            };

            let reducermap: ReducersMapObject<testState> = {
                ...dummyReducer,
                testStateProperty: dummyreducer
            };

            store = forge<testState>({
                type: "truffle",
                contracts: [Migrations],
                preloaded_contracts: ["Migrations"]
            }, {
                reducer: reducermap,
                custom_state: {testStateProperty: 23} as DeepPartial<testState>
            } as GeneratorConfig<testState>);
            let state: testState = store.getState();
            expect(state.testStateProperty).toBe(23);
        });

        test("Load dummy web3", (done: (err?: any) => void) => {

            store.subscribe(() => {
                if (store.getState().web3 && store.getState().web3._)
                    done();
            });

            store.dispatch({
                type: 'LOAD_WEB3',
                loader: getWeb3,
                networks: []
            } as Web3LoadAction);

        }, 10000)
    });
});

