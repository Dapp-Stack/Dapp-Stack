import { createTypes } from "../subscribes/index";

export const newBlockHeaders = createTypes("blocks", "newBlockHeaders");

export const blockHeaders = {
  GET_REQUEST: "BLOCKS/HEADERS/GET/REQUEST",
  GET_SUCCESS: "BLOCKS/HEADERS/GET/SUCCESS",
  GET_FAILURE: "BLOCKS/HEADERS/GET/FAILURE",
};
