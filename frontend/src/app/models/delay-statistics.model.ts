export interface DelayStatistics {
    routeName: string;
    averageDelayInSeconds: number;
    totalStops: number;
    punctualPercentage: number;
    slightlyDelayedPercentage: number;
    delayedPercentage: number;
    severelyDelayedPercentage: number;
}
  