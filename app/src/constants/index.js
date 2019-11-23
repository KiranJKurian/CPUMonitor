// Refresh Rate in seconds
export const REFRESH_RATE = 10;
// Amount of CPU Avg Load time to show in minutes
export const CPU_TIME_TO_SHOW = 10;

export const MAX_CPU_DATA_TO_SHOW = Math.floor(60 / REFRESH_RATE * CPU_TIME_TO_SHOW);

// Amount which CPU Load is considered to be high
export const HIGH_THRESHOLD_AMOUNT = 1;

// Duration to check if CPU Load is high in seconds
export const HIGH_THRESHOLD_DURATION = 2 * 60;

// Duration after high load before load status is recovered in seconds
export const HIGH_LOAD_COOLDOWN_DURATION = 2 * 60;

// Load statuses
export const LOAD_STATUS_NORMAL = 'NORMAL';
export const LOAD_STATUS_HIGH = 'HIGH';
export const LOAD_STATUS_RECOVERING = 'RECOVERING';
export const LOAD_STATUS_RECOVERED = 'RECOVERED';
