import {call, put, take, takeEvery, select} from 'redux-saga/effects';
import {SagaIterator, eventChannel, END} from "redux-saga";
import {Unsubscribe} from "redux";
import {EventAddAction, EventBroadcasted, EventInsertSubscription} from "./event.actions";
import {FeedNewError} from "../..";

function* createSubscription(contract_address: string, contract_name: string, event_name: string, args: string[], event_signature: string, link: any): SagaIterator {
    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let subscription;
        const subscription_creator = async (): Promise<void> => {
            try {
                let running: boolean = false;
                subscription = link.eth.subscribe("logs", {
                    address: contract_address,
                    topics: [event_signature, ...args]
                }, (err: Error, result: any): void => {
                    if (!running) {
                        running = true;
                    }
                    if (err) {
                        subscription.unsubscribe((): void => {});
                        throw err;
                    }
                    emit(EventBroadcasted(event_name, contract_name, contract_address, result));
                });
                subscription.killChannel = (): void => {
                    emit(END);
                };
            } catch (e) {
                emit(FeedNewError(e, e.message, "[event.sagas.ts][createSubscription] Trying to add event"));
                throw e;
            }
        };
        subscription_creator()
            .then(() => {
                emit(EventInsertSubscription(event_name + ":" + contract_name + ":" + contract_address, subscription));
            })
            .catch((e: Error): void => {
                emit(END);
            });
        return ((): void => {
            subscription.unsubscribe((error: Error, ok: boolean) => {

            });
        })
    });
}


function* onEventAdd(action: EventAddAction): SagaIterator {
    action.contract_address = action.contract_address.toLowerCase();
    const state = yield (select());
    if (state.backlink.status !== 'CONNECTED') {
        const error = ("[event.sagas.ts][onEventAdd] Request Event listening while backlink is not connected. Events won't be fetched.");
        console.warn(error);
        return ;
    }
    if (!state.contracts || !state.contracts[action.contract_name] || !state.contracts[action.contract_name].artifact || !state.contracts[action.contract_name].artifact.abi) {
        const error = new Error("Request Event listening on unknown contract type " + action.contract_name);
        console.error(error);
        yield put(FeedNewError(error, error.message, "[event.sagas.ts][onEventAdd] Trying to add event " + action.event_name));
    }
    let found;
    for (let abi_idx = 0; abi_idx < state.contracts[action.contract_name].artifact.abi.length; ++abi_idx) {
        if (state.contracts[action.contract_name].artifact.abi[abi_idx].type === 'event' && state.contracts[action.contract_name].artifact.abi[abi_idx].name === action.event_name) {
            found = state.contracts[action.contract_name].artifact.abi[abi_idx].signature;
        }
    }
    if (!found) {
        const error = new Error("No such event " + action.event_name + " in contract " + action.contract_name);
        console.error(error);
        yield put(FeedNewError(error, error.message, "[event.sagas.ts][onEventAdd] Trying to add event " + action.event_name));
    }

    const create_subscription = yield call(createSubscription, action.contract_address, action.contract_name, action.event_name, action.args || [], found, state.backlink.instance);

    try {
        while (true) {
            const event = yield take(create_subscription);
            yield put(event);
        }
    } finally {
        create_subscription.close();
    }
}

export function* EventSagas(): any {
    yield takeEvery('EVENT_ADD', onEventAdd);
}
