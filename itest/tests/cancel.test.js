/* @flow */

import {basename} from "path"
import {execSync} from "child_process"

import {
  killSearch,
  logIn,
  newAppInstance,
  resetState,
  setSpace,
  setSpan,
  startApp,
  startSearch,
  toggleOptimizations,
  writeSearch
} from "../lib/app.js"
import {retryUntil} from "../lib/control"
import {handleError, stdTest} from "../lib/jest.js"
import {LOG} from "../lib/log"
import {dataSets} from "../../src/js/test/integration"

describe("Cancellation tests", () => {
  let app
  let testIdx = 0
  beforeEach(() => {
    app = newAppInstance(basename(__filename), ++testIdx)
    return startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      await resetState(app)
      return await app.stop()
    }
  })

  // These are simplistic because all I care about at this time is whether a
  // search is running.
  const getTasks = () => {
    let processStatus = execSync("boom ps")
    LOG.debug("boom ps output:\n" + processStatus.toString())
    return processStatus
  }

  const isSearchRunning = () => getTasks().includes("POST")

  const setupFlow = async (app) => {
    await logIn(app)
    await setSpace(app, dataSets.hq_integration.spaceName)
    await setSpan(app, "Whole Space")
    // Disable optimizations to make queries slower.
    await toggleOptimizations(app)
    await writeSearch(app, "* | head 1000000 | sort id.resp_p")
    expect(isSearchRunning()).toBe(false)
    await startSearch(app)
    await blockUntilTrue(isSearchRunning)
  }

  const blockUntilTrue = async (f) =>
    // Use retryUntil to loop until f is true. This is needed to prevent races
    // between test steps and searches actually being started/cancelled.
    await retryUntil(
      () => new Promise((resolve) => resolve()),
      (_) => f(),
      10,
      1000
    )

  stdTest("cancel query from Kill search works", (done) => {
    setupFlow(app)
      .then(async () => {
        await killSearch(app)
        await blockUntilTrue(() => !isSearchRunning())
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
