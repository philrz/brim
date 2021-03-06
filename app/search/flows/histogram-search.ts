import brim from "src/js/brim"
import {search} from "src/js/flows/search/mod"
import {SearchResponse} from "src/js/flows/search/response"
import ErrorFactory from "src/js/models/ErrorFactory"
import {addEveryCountProc} from "src/js/searches/histogramSearch"
import Chart from "src/js/state/Chart"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"

const id = "Histogram"

export function histogramSearch(): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const state = getState()
    const {program, spanArgs, pins} = Url.getSearchParams(state)
    const brimProgram = brim.program(program, pins)
    const [from, to] = brim.span(spanArgs).toDateTuple()
    const query = addEveryCountProc(brimProgram.string(), [from, to])
    const poolId = Current.mustGetPool(state).id
    const {response, promise} = dispatch(search({id, query, from, to, poolId}))
    dispatch(handle(response))
    return promise
  }
}

function handle(response: SearchResponse): Thunk {
  return function(dispatch, getState) {
    const tabId = Tabs.getActive(getState())
    const params = Url.getSearchParams(getState())

    if (!params.keep) dispatch(Chart.clear(tabId))
    dispatch(Chart.setStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Chart.setStatus(tabId, status)))
      .chan(0, ({rows}) => dispatch(Chart.appendRecords(tabId, rows)))
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))
  }
}
