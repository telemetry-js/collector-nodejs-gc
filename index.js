'use strict'

const gctime = require('gctime')
const summary = require('@telemetry-js/metric').summary
const EventEmitter = require('events').EventEmitter

// As gctime's state is semiglobal atm, ours must be too.
let startedGlobally = false

module.exports = function plugin () {
  return new GCCollector()
}

class GCCollector extends EventEmitter {
  constructor () {
    super()

    this._metricOptions = {
      unit: 'microseconds',
      stats: {
        sum: 0,
        min: Number.POSITIVE_INFINITY,
        max: Number.NEGATIVE_INFINITY,
        count: 0
      }
    }

    this._started = false
    this._gcstats = gctime.get()
  }

  start (callback) {
    if (!this._started) {
      if (startedGlobally) {
        throw new Error('This plugin can only be used by one task at a time')
      }

      startedGlobally = true
      this._started = true

      gctime.start()
    }

    process.nextTick(callback)
  }

  stop (callback) {
    if (this._started) {
      if (!startedGlobally) {
        throw new Error('This plugin can only be used by one task at a time')
      }

      startedGlobally = false
      this._started = false

      gctime.stop()
    }

    process.nextTick(callback)
  }

  // TODO (later): seeing as this plugin emits summary metrics, should it run on
  // its own schedule?
  ping (callback) {
    gctime.accumulate(this._gcstats)

    const stats = this._metricOptions.stats

    // Convert summary from gctime format to telemetry format
    stats.sum = microseconds(this._gcstats.sum)
    stats.min = microseconds(this._gcstats.min)
    stats.max = microseconds(this._gcstats.max)
    stats.count = this._gcstats.size

    // TODO (later): stats.reset()
    reset(this._gcstats)

    // TODO: reuse metric objects between pings
    const metric = summary('telemetry.nodejs.gc.duration.us', this._metricOptions)
    this.emit('metric', metric)

    // No need to dezalgo ping()
    callback()
  }
}

function reset (gcstats) {
  gcstats.min = [0, 0]
  gcstats.max = [0, 0]
  gcstats.sum = [0, 0]
  gcstats.size = 0
}

function microseconds (hrtime) {
  return hrtime[0] * 1e6 + hrtime[1] / 1e3
}
