import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import Chart from '../Chart';

const CPU_INFO = gql`
  {
    cpu {
      normalizedLoadAvg
    }
  }
`;

// Refresh Rate in seconds
const REFRESH_RATE = 10;
// Amount of CPU Avg Load time to show in minutes
const CPU_TIME_TO_SHOW = 10;

const MAX_CPU_DATA_TO_SHOW = Math.floor(60 / REFRESH_RATE * CPU_TIME_TO_SHOW);

// Amount which CPU Load is considered to be high
const HIGH_THRESHOLD_AMOUNT = 1;

// Duration to check if CPU Load is high in seconds
const HIGH_THRESHOLD_DURATION = 2 *60;

const CPUInfo = () => {
  const {
    loading,
    error,
    data: {
      cpu: {
        normalizedLoadAvg = 0,
      } = {},
    } = {},
  } = useQuery(CPU_INFO, {
    pollInterval: REFRESH_RATE * 1000,
  });

  const [chartData, setChartData] = useState([]);
  const [highLoad, setHighLoad] = useState(false);

  useEffect(() => {
    setChartData((data => [
      ...data.slice(-1 * MAX_CPU_DATA_TO_SHOW),
      normalizedLoadAvg
    ]));
  }, [normalizedLoadAvg]);

  useEffect(() => {
    const chartDataInThresholdRange = chartData.slice(-1 * Math.max(HIGH_THRESHOLD_DURATION / REFRESH_RATE, 1));
    const highLoad = chartDataInThresholdRange.length > 0 && chartDataInThresholdRange.every(load => load >= HIGH_THRESHOLD_AMOUNT);
    setHighLoad(highLoad);
  }, [chartData]);

  useEffect(() => {
    if (highLoad) {
      toast.warn('CPU Load High!');
    }
  }, [highLoad]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Current Load Avg: {normalizedLoadAvg}</h1>
      <h1>Load is: {highLoad ? 'High' : 'Normal'}</h1>
      <Chart data={chartData} />
    </div>
  );
}

export default CPUInfo;