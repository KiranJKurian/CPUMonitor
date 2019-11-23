import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  LOAD_STATUS_NORMAL,
  LOAD_STATUS_HIGH,
  LOAD_STATUS_RECOVERING,
  LOAD_STATUS_RECOVERED,
} from '../constants';
import normalizedLoadAvgAndDateTime from '../graphql/queries/normalizedLoadAvgAndDateTime';

export default ({
  refreshRate,
  dataToShow,
  highThresholdAmount,
  highThresholdDuration,
  highLoadCoolDownDuration,
}) => {
  // Apollo Query
  const { loading, error, data } = useQuery(normalizedLoadAvgAndDateTime, {
    pollInterval: refreshRate * 1000,
  });

  const [chartData, setChartData] = useState([]);
  const [loadStatus, setLoadStatus] = useState(LOAD_STATUS_NORMAL);

  // Add queried data to chartData
  useEffect(() => {
    const {
      cpu: {
        // Start the graph off at loadAvg = 0
        normalizedLoadAvg = 0,
      } = {},
      // FIXME: Possible issue if client and host clocks are out of sync for the first default datapoint
      datetime = Date.now(),
    } = data || {};

    setChartData(chartData => [
      ...chartData.slice(-1 * dataToShow),
      { load: normalizedLoadAvg, datetime: new Date(datetime) },
    ]);
  }, [data, dataToShow]);

  // Sets load status based on chart data in threshold/cooldown range
  useEffect(() => {
    const chartDataInThresholdRange = chartData.slice(
      -1 * Math.floor(highThresholdDuration / refreshRate)
    );
    // High load is when every load for the last X (threshold duration) seconds is equal or greater than the high threshold amount
    const highLoad =
      chartDataInThresholdRange.length > 0 &&
      chartDataInThresholdRange.every(
        ({ load }) => load >= highThresholdAmount
      );

    if (highLoad) {
      setLoadStatus(LOAD_STATUS_HIGH);
    } else {
      const chartDataInCooldownRange = chartData.slice(
        -1 * Math.floor(highLoadCoolDownDuration / refreshRate)
      );
      // Low load is when every load for the last X (cooldown duration) seconds is less than the high threshold amount
      const lowLoad =
        chartDataInCooldownRange.length > 0 &&
        chartDataInCooldownRange.every(
          ({ load }) => load < highThresholdAmount
        );

      // Sets loadStatus to Recovering if it was previously high and highLoad is false
      // Sets loadStatus to Recovered if it was previously recovering and lowLoad is true
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

  return {
    loading,
    error,
    chartData,
    loadStatus,
  };
};
