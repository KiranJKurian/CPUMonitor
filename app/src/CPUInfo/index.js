import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import Chart from '../Chart';

const CPU_INFO = gql`
  {
    cpu {
      normalizedLoadAvg
    }
    datetime
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
const HIGH_THRESHOLD_DURATION = 2 * 60;

// Duration after high load before load status is recovered in seconds
const HIGH_LOAD_COOLDOWN_DURATION = 2 * 60;

// Load statuses
const LOAD_STATUS_NORMAL = 'NORMAL';
const LOAD_STATUS_HIGH = 'HIGH';
const LOAD_STATUS_RECOVERING = 'RECOVERING';
const LOAD_STATUS_RECOVERED = 'RECOVERED';

const CPUInfo = ({
  refreshRate,
  dataToShow,
  highThresholdAmount,
  highThresholdDuration,
  highLoadCoolDownDuration,
}) => {
  const {
    loading,
    error,
    data,
  } = useQuery(CPU_INFO, {
    pollInterval: refreshRate * 1000,
  });

  const [chartData, setChartData] = useState([]);
  const [loadStatus, setLoadStatus] = useState(LOAD_STATUS_NORMAL);

  useEffect(() => {
    const {
      cpu: {
        // Start the graph off at loadAvg = 0
        normalizedLoadAvg = 0,
      } = {},
      datetime = Date.now(),
    } = data || {};

    setChartData((chartData => [
      ...chartData.slice(-1 * dataToShow),
      { load: normalizedLoadAvg, datetime: new Date(datetime) },
    ]));
  }, [data, dataToShow]);

  useEffect(() => {
    const chartDataInThresholdRange = chartData.slice(
      -1 * Math.floor(highThresholdDuration / refreshRate)
    );
    const highLoad = chartDataInThresholdRange.length > 0 && chartDataInThresholdRange
      .every(({ load }) => load >= highThresholdAmount);
    
    if (highLoad) {
      setLoadStatus(LOAD_STATUS_HIGH);
    } else {
      const chartDataInCooldownRange = chartData.slice(
        -1 * Math.floor(highLoadCoolDownDuration / refreshRate)
      );
      const lowLoad = chartDataInCooldownRange.length > 0 && chartDataInCooldownRange
        .every(({ load }) => load < highThresholdAmount);
      if (lowLoad && loadStatus === LOAD_STATUS_RECOVERING) {
        setLoadStatus(LOAD_STATUS_RECOVERED);
      } else if (loadStatus === LOAD_STATUS_HIGH) {
        setLoadStatus(LOAD_STATUS_RECOVERING);
      }
    }
  }, [
    chartData,
    loadStatus,
    highThresholdDuration,
    refreshRate,
    highThresholdAmount,
    highLoadCoolDownDuration,
  ]);

  useEffect(() => {
    switch (loadStatus) {
      case LOAD_STATUS_HIGH:
        toast.error('CPU Load High!');
        break;
      case LOAD_STATUS_RECOVERING:
        toast.warn('CPU Load Recovering...');
        break;
      case LOAD_STATUS_RECOVERED:
        toast.success('CPU Load Recovered');
        break;
      default:
        break;
    }
  }, [loadStatus]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const {
    cpu: {
      normalizedLoadAvg = 0,
    } = {},
  } = data || {};

  return (
    <div>
      <h1>Current Load Avg: {normalizedLoadAvg}</h1>
      <Chart data={chartData} highThresholdAmount={highThresholdAmount} />
    </div>
  );
}

CPUInfo.propTypes = {
  refreshRate: PropTypes.number,
  dataToShow: PropTypes.number,
  highThresholdAmount: PropTypes.number,
  highThresholdDuration: PropTypes.number,
  highLoadCoolDownDuration: PropTypes.number,
};

CPUInfo.defaultProps = {
  refreshRate: REFRESH_RATE,
  dataToShow: MAX_CPU_DATA_TO_SHOW,
  highThresholdAmount: HIGH_THRESHOLD_AMOUNT,
  highThresholdDuration: HIGH_THRESHOLD_DURATION,
  highLoadCoolDownDuration: HIGH_LOAD_COOLDOWN_DURATION,
};

export default CPUInfo;