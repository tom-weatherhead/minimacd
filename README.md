# minimacd
A compact implementation of Gerald Appel's MACD (Moving Average Convergence / Divergence) formula.

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tom-weatherhead/minimacd/blob/master/LICENSE)

This implementation is:

- Compact: Less than 1000 bytes! (817 bytes as of 2020-04-17)
- Self-contained: No dependencies
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
