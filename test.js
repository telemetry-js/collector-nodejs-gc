'use strict'

const test = require('tape')
const proxyquire = require('proxyquire')

const startSpies = []
const accSpies = []

const plugin = proxyquire('.', {
  gctime: {
    get () {
      return new HighResolutionStats()
    },
    start (...args) {
      startSpies.shift()(...args)
    },
    accumulate (...args) {
      accSpies.shift()(...args)
    }
  }
})

test('basic', async function (t) {
  t.plan(3)

  const collector = plugin()

  startSpies.push(() => {
    t.pass('started')
  })

  await start(collector)

  accSpies.push((stats) => {
    stats.min = [1, 1000]
    stats.max = [1, 1000]
    stats.sum = [1, 1000]
    stats.size = 1
  })

  t.same(await collect(collector), [{
    name: 'telemetry.nodejs.gc.duration.us',
    unit: 'microseconds',
    resolution: 60,
    tags: {},
    stats: {
      sum: 1000001,
      min: 1000001,
      max: 1000001,
      count: 1
    }
  }])

  accSpies.push((stats) => {
    stats.min = [0, 1000]
    stats.max = [1, 1000]
    stats.sum = [1, 2000]
    stats.size = 2
  })

  t.same(await collect(collector), [{
    name: 'telemetry.nodejs.gc.duration.us',
    unit: 'microseconds',
    resolution: 60,
    tags: {},
    stats: {
      sum: 1000002,
      min: 1,
      max: 1000001,
      count: 2
    }
  }])
})

function start (collector) {
  return new Promise((resolve, reject) => {
    collector.start((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function collect (collector) {
  return new Promise((resolve, reject) => {
    const metrics = []
    const push = metrics.push.bind(metrics)

    collector.on('metric', push)

    collector.ping((err) => {
      collector.removeListener('metric', push)
      if (err) reject(err)
      else resolve(metrics.map(simplify))
    })
  })
}

function simplify (metric) {
  delete metric.date
  delete metric.statistic

  return metric
}

// Same as gctime
function HighResolutionStats () {
  this.min = [0, 0]
  this.max = [0, 0]
  this.sum = [0, 0]
  this.size = 0
}
