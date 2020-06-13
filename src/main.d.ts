export declare function ema(
	array: number[],
	period: number,
	seedLength?: number
): number[];
export declare function macd(
	array: number[],
	fastPeriod?: number,
	slowPeriod?: number,
	signalPeriod?: number,
	usePeriodAsSeedLength?: boolean
): [number[], number[]];
