import React from 'react';
import PropTypes from 'prop-types';

import Chart from '../Chart';
import {
  REFRESH_RATE,
  MAX_CPU_DATA_TO_SHOW,
  HIGH_THRESHOLD_AMOUNT,
  HIGH_THRESHOLD_DURATION,
  HIGH_LOAD_COOLDOWN_DURATION,
} from '../../constants';
import useChartDataAndLoadStatus from '../../hooks/useChartDataAndLoadStatus';
import useLoadStatusToastEffect from '../../hooks/useLoadStatusToastEffect';

const CPUInfo = ({
  refreshRate,
  dataToShow,
  highThresholdAmount,
  highThresholdDuration,
  highLoadCoolDownDuration,
}) => {
  // Queries CPU data and manages chartData and loadStatus state
  const { loading, error, chartData, loadStatus } = useChartDataAndLoadStatus({
    refreshRate,
    dataToShow,
    highThresholdAmount,
    highThresholdDuration,
    highLoadCoolDownDuration,
  });

  // Handles toast alerts based on loadStatus
  useLoadStatusToastEffect(loadStatus);

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
