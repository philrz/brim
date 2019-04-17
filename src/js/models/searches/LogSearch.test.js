/* @flow */

import {PER_PAGE} from "../../state/reducers/logViewer"
import LogSearch from "./LogSearch"

describe("LogSearch", () => {
  const program = "_path = conn"
  const span = [new Date(0), new Date(10)]

  let base
  beforeEach(() => {
    base = new LogSearch(program, span)
  })

  test("#getProgram", () => {
    expect(base.getProgram()).toEqual(`_path = conn | head ${PER_PAGE}`)
  })
})
