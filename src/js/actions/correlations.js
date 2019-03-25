/* @flow */

import type {Thunk} from "../reducers/types"
import {getTimeWindow} from "../reducers/timeWindow"
import {issueBoomSearch} from "./boomSearches"
import Log from "../models/Log"
import Md5Search from "../models/searches/Md5Search"
import UidSearch from "../models/searches/UidSearch"

export const setCorrelation = (key: string, name: string, data: *) => ({
  type: "CORRELATION_SET",
  key,
  name,
  data
})

export const clearCorrelations = (key: string) => ({
  type: "CORRELATIONS_CLEAR",
  key
})

export const clearAllCorrelations = () => ({
  type: "CORRELATIONS_CLEAR_ALL"
})

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  if (log.correlationId()) {
    const search = new UidSearch(log, getTimeWindow(getState()))
    return dispatch(issueBoomSearch(search, "detail"))
  }
}

export const fetchByMd5 = (log: Log): Thunk => (dispatch, getState) => {
  if (log.get("md5")) {
    const search = new Md5Search(log, getTimeWindow(getState()))
    return dispatch(issueBoomSearch(search, "detail"))
  }
}