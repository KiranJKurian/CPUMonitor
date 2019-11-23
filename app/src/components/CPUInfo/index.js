import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import Chart from '../Chart';
import {
  REFRESH_RATE,
  MAX_CPU_DATA_TO_SHOW,
  HIGH_THRESHOLD_AMOUNT,
  HIGH_THRESHOLD_DURATION,
  HIGH_LOAD_COOLDOWN_DURATION,
  LOAD_STATUS_HIGH,
  LOAD_STATUS_RECOVERING,
  LOAD_STATUS_RECOVERED,
} from '../../constants';
import useChartDataAndLoadStatus from '../../hooks/useChartDataAndLoadStatus';

const CPUInfo = ({
  refreshRate,
  dataToShow,
  highThresholdAmount,
  highThresholdDuration,
  highLoadCoolDownDuration,
}) => {
  const { loading, error, chartData, loadStatus } = useChartDataAndLoadStatus({
    refreshRate,
    dataToShow,
    highThresholdAmount,
    highThresholdDuration,
    highLoadCoolDownDuration,
  });

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

  const { load: normalizedLoadAvg = 0 } = chartData[chartData.length - 1] || {};

  return (
    <div>
      <h1>Current Load Avg: {normalizedLoadAvg}</h1>
      <Chart data={chartData} highThresholdAmount={highThresholdAmount} />
    </div>
  );
};

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
