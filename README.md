# minimacd
A versatile, compact (807 bytes) Javascript implementation of Gerald Appel's MACD (Moving Average Convergence / Divergence) formula.

Obligatory BadgeFest:

[![circleci][circleci-badge-image]][circleci-url]
[![git][git-badge-image]][git-url]
[![github][github-badge-image]][github-url]
[![npm][npm-badge-image]][npm-url]
[![terminal][terminal-badge-image]][terminal-url]
[![typescript][typescript-badge-image]][typescript-url]

[![build status][build-status-badge-image]][build-status-url]
[![npm version][npm-version-badge-image]][npm-version-url]
[![npm total downloads][npm-total-downloads-badge-image]][npm-total-downloads-url]
[![watchers][watchers-badge-image]][watchers-url]
[![stars][stars-badge-image]][stars-url]
[![issues][issues-badge-image]][issues-url]
[![forks][forks-badge-image]][forks-url]
[![contributors][contributors-badge-image]][contributors-url]
[![branches][branches-badge-image]][branches-url]
[![releases][releases-badge-image]][releases-url]
[![commits][commits-badge-image]][commits-url]
[![last commit][last-commit-badge-image]][last-commit-url]
[![types][types-badge-image]][types-url]
[![install size][install-size-badge-image]][install-size-url]
[![known vulnerabilities][known-vulnerabilities-badge-image]][known-vulnerabilities-url]
[![tested with jest][jest-badge-image]][jest-url]
[![code style: prettier][prettier-badge-image]][prettier-url]
[![license][license-badge-image]][license-url]

## Features

- Self-contained: No run-time package dependencies!
- Compact: Only 807 bytes!
- Versatile: The Exponential Moving Average can be seeded in two ways

## ema() : Exponential Moving Average

```js
function ema(
	array: number[],
	period: number,
	usePeriodAsSeedLength: boolean
): number[] { ... }
```

See Gerald Appel's book 'Technical Analysis - Power Tools for Active Investors', chapter 6, pp. 134-137

```js
const alpha = 2 / (period + 1); // The smoothing constant (Appel p. 134)
```

meanValue is the initial value which stabilizes the exponential average.
It is the simple average of the first seedLength values in the array,
after skipping any initial run of invalid values (e.g. NaN)
See the section 'Stabilizing the Exponential Average' (Appel p. 136)

Developers' note: Do not try to replace this:
```js
result = alpha * element + (1 - alpha) * result;
```
... with either of these:
```js
result += alpha * (element - result);
result = alpha * (element - result) + result;
```
They are the same algebraically, but the latter two provide different results than the former due to limited floating-point precision.

## macd() : Moving Average Convergence / Divergence

```js
function macd(
	array: number[],
	fastPeriod = 12,
	slowPeriod = 26,
	signalPeriod = 9,
	usePeriodAsSeedLength = false
): number[][] { ... }
```
This function returns a two-element tuple consisting of [macdArray, signalArray].

- When usePeriodAsSeedLength is falsy, this algorithm behaves like the npm package [macd](https://github.com/kaelzhang/macd) written by Kael Zhang; i.e. the EMA will be seeded with the first value in the array.
- When usePeriodAsSeedLength is truthy, this algorithm behaves like indicatorMacd in the npm package [@d3fc/d3fc-technical-indicator](https://github.com/d3fc/d3fc); i.e. the EMA will be seeded with the simple average (the mean) of the first n values in the array, where n is the EMA's period.

In general terms, macd is defined as this:

```js
function macd(array, fastPeriod, slowPeriod) {
	return ema(array, fastPeriod) - ema(array, slowPeriod);
}
```

A signal(n) value is the EMA (with period = n) of consecutive MACD values.

## License
[MIT](https://choosealicense.com/licenses/mit/)

[circleci-badge-image]: https://badgen.net/badge/icon/circleci?icon=circleci&label
[circleci-url]: https://circleci.com
[git-badge-image]: https://badgen.net/badge/icon/git?icon=git&label
[git-url]: https://git-scm.com
[github-badge-image]: https://badgen.net/badge/icon/github?icon=github&label
[github-url]: https://github.com
[npm-badge-image]: https://badgen.net/badge/icon/npm?icon=npm&label
[npm-url]: https://npmjs.com
[terminal-badge-image]: https://badgen.net/badge/icon/terminal?icon=terminal&label
[terminal-url]: https://en.wikipedia.org/wiki/History_of_Unix
[typescript-badge-image]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[typescript-url]: https://www.typescriptlang.org

[build-status-badge-image]: https://circleci.com/gh/tom-weatherhead/minimacd.svg?style=shield
[build-status-url]: https://circleci.com/gh/tom-weatherhead/minimacd
[npm-version-badge-image]: https://img.shields.io/npm/v/minimacd.svg
[npm-version-url]: https://www.npmjs.com/package/minimacd
[latest-tag-badge-image]: https://badgen.net/github/tag/tom-weatherhead/minimacd
[latest-tag-url]: https://github.com/tom-weatherhead/minimacd/tags
[npm-total-downloads-badge-image]: https://img.shields.io/npm/dt/minimacd.svg
[npm-total-downloads-url]: https://www.npmjs.com/package/minimacd
[watchers-badge-image]: https://badgen.net/github/watchers/tom-weatherhead/minimacd
[watchers-url]: https://github.com/tom-weatherhead/minimacd/watchers
[stars-badge-image]: https://badgen.net/github/stars/tom-weatherhead/minimacd
[stars-url]: https://github.com/tom-weatherhead/minimacd/stargazers
[issues-badge-image]: https://badgen.net/github/issues/tom-weatherhead/minimacd
[issues-url]: https://github.com/tom-weatherhead/minimacd/issues
[forks-badge-image]: https://badgen.net/github/forks/tom-weatherhead/minimacd
[forks-url]: https://github.com/tom-weatherhead/minimacd/network/members
[contributors-badge-image]: https://badgen.net/github/contributors/tom-weatherhead/minimacd
[contributors-url]: https://github.com/tom-weatherhead/minimacd/graphs/contributors
[branches-badge-image]: https://badgen.net/github/branches/tom-weatherhead/minimacd
[branches-url]: https://github.com/tom-weatherhead/minimacd/branches
[releases-badge-image]: https://badgen.net/github/releases/tom-weatherhead/minimacd
[releases-url]: https://github.com/tom-weatherhead/minimacd/releases
[commits-badge-image]: https://badgen.net/github/commits/tom-weatherhead/minimacd
[commits-url]: https://github.com/tom-weatherhead/minimacd/commits/master
[last-commit-badge-image]: https://badgen.net/github/last-commit/tom-weatherhead/minimacd
[last-commit-url]: https://github.com/tom-weatherhead/minimacd
[types-badge-image]: https://badgen.net/npm/types/minimacd
[types-url]: https://badgen.net/npm/types/minimacd
[install-size-badge-image]: https://badgen.net/packagephobia/install/minimacd
[install-size-url]: https://badgen.net/packagephobia/install/minimacd
[known-vulnerabilities-badge-image]: https://snyk.io/test/github/tom-weatherhead/minimacd/badge.svg?targetFile=package.json&package-lock.json
[known-vulnerabilities-url]: https://snyk.io/test/github/tom-weatherhead/minimacd?targetFile=package.json&package-lock.json
[jest-badge-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest
[prettier-badge-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-badge-image]: https://img.shields.io/github/license/mashape/apistatus.svg
[license-url]: https://github.com/tom-weatherhead/minimacd/blob/master/LICENSE
