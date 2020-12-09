# collector-nodejs-gc

> **Collect Node.js garbage collection duration metric.**  
> A [`telemetry`](https://github.com/telemetry-js/telemetry) plugin.

[![npm status](http://img.shields.io/npm/v/@telemetry-js/collector-nodejs-gc.svg)](https://www.npmjs.org/package/@telemetry-js/collector-nodejs-gc)
[![node](https://img.shields.io/node/v/@telemetry-js/collector-nodejs-gc.svg)](https://www.npmjs.org/package/@telemetry-js/collector-nodejs-gc)
[![Test](https://github.com/telemetry-js/collector-nodejs-gc/workflows/Test/badge.svg?branch=main)](https://github.com/telemetry-js/collector-nodejs-gc/actions)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Table of Contents

<details><summary>Click to expand</summary>

- [Usage](#usage)
- [API](#api)
  - [Options](#options)
- [Install](#install)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

## Usage

```js
const telemetry = require('@telemetry-js/telemetry')()
const gc = require('@telemetry-js/collector-nodejs-gc')

telemetry.task()
  .collect(gc)
```

## API

### Options

None.

## Install

With [npm](https://npmjs.org) do:

```
npm install @telemetry-js/collector-nodejs-gc
```

## Acknowledgements

This project is kindly sponsored by [Reason Cybersecurity Ltd](https://reasonsecurity.com).

[![reason logo](https://cdn.reasonsecurity.com/github-assets/reason_signature_logo.png)](https://reasonsecurity.com)

## License

[MIT](LICENSE) © Vincent Weevers
