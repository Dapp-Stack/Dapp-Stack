export const actionTypes = {
  FOO: 'FOO',
  BAR: 'BAR',
};

export const action = (type, payload = {}) => ({ type, ...payload });
