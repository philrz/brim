import {basename} from "path"

import appStep from "../helpers/appStep/api"
import newAppInstance from "../helpers/newAppInstance"
import {retryUntil} from "../helpers/control"
import {handleError} from "../helpers/jest"
import {selectors} from "../helpers/integration"
import {LOG} from "../helpers/log"

describe("Histogram tests", () => {
  let app
  let testIdx = 0
  beforeEach(async (done) => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await appStep.startApp(app)
    done()
  })

  afterEach(async (done) => {
    if (app && app.isRunning()) {
      await app.stop()
    }
    done()
  })

  test("histogram deep inspection", (done) => {
    LOG.debug("Pre-login")
    appStep
      .ingestFile(app, "sample.pcap")
      .then(async () => {
        await appStep.search(app, "")
      })
      .then(async () => {
        LOG.debug("Checking a histogram appears")
        // Verify that a histogram of at least *partial data* is present.
        await retryUntil(
          () => app.client.$$(selectors.histogram.rectElem),
          (rectElements) => rectElements.length > 0
        ).catch(() => {
          throw new Error("Initial histogram did not render any rect elements")
        })
        LOG.debug("Got number of histogram rect elements")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
