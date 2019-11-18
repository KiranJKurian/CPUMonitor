import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Chart from '../Chart';

const CPU_INFO = gql`
  {
    cpu {
      loadavg {
        oneMinuteLoadAvg
      }
      percentLoad
    }
  }
`;

// Refresh Rate in seconds
const REFRESH_RATE = 10;
// Amount of CPU Avg Load time to show in minutes
const CPU_TIME_TO_SHOW = 10;

const MAX_CPU_DATA_TO_SHOW = Math.floor(60 / REFRESH_RATE * CPU_TIME_TO_SHOW);

const CPUInfo = () => {
  const {
    loading,
    error,
    data: {
      cpu: {
        loadavg: {
          oneMinuteLoadAvg,
        } = {},
        percentLoad = 0,
      } = {},
    } = {},
  } = useQuery(CPU_INFO, {
    pollInterval: REFRESH_RATE * 1000,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData((data => [
      ...data.slice(Math.max(data.length - MAX_CPU_DATA_TO_SHOW, 0)),
      percentLoad
    ]));
  }, [percentLoad]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Load Avg: {oneMinuteLoadAvg}</h1>
      <Chart data={chartData} />
    </div>
  );
}

export default CPUInfo;