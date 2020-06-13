// minimacd/src/main.ts

/*!
 * npm module 'minimacd'
 *
 * minimacd <https://github.com/tom-weatherhead/minimacd>
 *
 * Copyright © 2020 Tom Weatherhead.
 * Released under the MIT License.
 */

// 'use strict';

// This 'portability wrapper' was wantonly and gratuitously stolen,
// pilfered, lifted, borrowed, or otherwise acquired from the npm module
// 'is-windows' <https://github.com/jonschlinkert/is-windows>

declare const define: any;

(function (factory) {
	// Old: if (exports && typeof exports === 'object' && typeof module !== 'undefined') {
	// X: TODO: If no object can be falsy, then try this:
	// if (typeof exports === 'object' && typeof module !== 'undefined') {
	// NO: null is falsy, but typeof null is 'object'
	if (
		typeof exports === 'object' &&
		exports &&
		typeof module !== 'undefined'
	) {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof window !== 'undefined') {
		(window as any).minimacd = factory();
	} else if (typeof global !== 'undefined') {
		(global as any).minimacd = factory();
	} else if (typeof self !== 'undefined') {
		(self as any).minimacd = factory();
	} else {
		// In tsconfig.json, set compilerOptions.noImplicitThis to false to avoid this error:
		// error TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
		this.minimacd = factory();
	}
})(function () {
	// EMA: Exponential moving average
	// See Gerald Appel's book 'Technical Analysis - Power Tools for Active Investors', chapter 6, pp. 134-137

	function ema(
		array: number[],
		period: number,
		usePeriodAsSeedLength: boolean
	): number[] {
		// This implementation of isNumber was stolen from:
		// https://github.com/jonschlinkert/is-number.git
		// https://github.com/jonschlinkert/kind-of.git
		// ... and then condensed.

		// module.exports = function isNumber(num) {
		// 	var type = typeOf(num); // Essentially, type = typeof num;

		// 	if (type === 'string') {
		// 		if (!num.trim()) return false; // num is the empty string
		// 	} else if (type !== 'number') {
		// 		return false; // num is not a number
		// 	}

		// num is either a number or a non-empty string.

		// 	return (num - num + 1) >= 0;
		// };

		// string.trim() returns the trimmed string (with whitespace removed from both ends); it is falsy iff it is the empty string.
		// This prevents our code from interpreting the empty string as the number zero.

		// const isNumber = (n: any) => (typeof n === 'number' || (typeof n === 'string' && n.trim())) && (n as number) - (n as number) + 1 >= 0;
		const isNumber = (n: any) => !Number.isNaN(n); // 44 bytes smaller

		const mean = (arg: number[]) =>
			arg.length <= 0
				? NaN
				: arg.reduce(
						(accumulator: number, n: number) => accumulator + n,
						0
				  ) / arg.length;

		const alpha = 2 / (period + 1); // The smoothing constant (Appel p. 134)
		const seedLength = usePeriodAsSeedLength ? period : 1;
		let i = 0;

		while (i < array.length && !isNumber(array[i])) {
			i++;
		}

		let j = Math.min(i + seedLength - 1, array.length);
		const result = new Array(j).fill(NaN); // The array of EMAs
		let lastEma = mean(array.slice(i, i + seedLength)); // meanValue

		for (j++; j <= array.length; j++) {
			// We want this loop to push (array.length - j) values
			// but we only need it to read (array.length - j) - 1 values from array.
			// const element = array[j] || NaN;

			result.push(lastEma);

			// if (!isNumber(lastEma)) {
			// 	lastEma = element;
			// } else /* if (isNumber(element)) */ {
			// lastEma = alpha * element + (1 - alpha) * lastEma;
			// lastEma = alpha * (array[j] || NaN) + (1 - alpha) * lastEma; // Yes; 824 bytes
			lastEma = alpha * array[j] + (1 - alpha) * lastEma; // Yes; 817 bytes
			// }
		}

		return result;
	}

	function macd(
		array: number[],
		fastPeriod = 12,
		slowPeriod = 26,
		signalPeriod = 9,
		usePeriodAsSeedLength = false
	): number[][] {
		// macd := ema(array, fastPeriod) - ema(array, slowPeriod)

		// The flag usePeriodAsSeedLength determines which seed value is used to stabilize the Exponential Moving Average:

		// - When usePeriodAsSeedLength is falsy, this algorithm behaves like the npm package 'macd' written by Kael Zhang; i.e. the EMA will be seeded with the first value in the array.

		// - When usePeriodAsSeedLength is truthy, this algorithm behaves like indicatorMacd in the npm package '@d3fc/d3fc-technical-indicator'; i.e. the EMA will be seeded with the simple average (the mean) of the first n values in the array, where n is the EMA's period.

		// See the section 'Stabilizing the Exponential Average' (Appel p. 136)

		const fastEma = ema(array, fastPeriod, usePeriodAsSeedLength);
		const slowEma = ema(array, slowPeriod, usePeriodAsSeedLength);
		const macdArray = fastEma.map(
			(f: number, i: number): number => f - slowEma[i]
		);
		const signalArray = ema(
			macdArray,
			signalPeriod,
			usePeriodAsSeedLength
		);

		return [macdArray, signalArray];
	}

	return {
		ema: ema,
		macd: macd
	};
});
