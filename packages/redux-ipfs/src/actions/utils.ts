const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

type CreateRequestType = {
  [type: string]: string;
};

export function createRequestTypes(base: string): CreateRequestType {
  const types = [REQUEST, SUCCESS, FAILURE];
  return types.reduce((acc: CreateRequestType, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}

export function action(type: string, payload = {}) {
  return { type, ...payload };
}
