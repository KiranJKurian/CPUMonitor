import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = ({
  data,
  highThresholdAmount,
  highThresholdColor,
  lowThresholdColor,
}) => {
  const transformedData = data.map(({ load, datetime }) => ({
    y: load,
    name: new Date(datetime),
  }));

  const options = {
    title: {
      text: 'CPU Load Averages',
    },
    xAxis: {
      categories: data.map(({ datetime }) => datetime.toLocaleTimeString()),
      title: {
        text: 'Time',
      },
    },
    yAxis: {
      title: {
        text: 'Load',
      },
    },
    series: [
      {
        name: 'Load',
        type: 'area',
        data: transformedData,
        zoneAxis: 'x',
        zones: transformedData.map(({ y }, index) => ({
          color:
            y >= highThresholdAmount ? highThresholdColor : lowThresholdColor,
          value: index,
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      load: PropTypes.number,
      datetime: PropTypes.instanceOf(Date),
    })
  ),
  highThresholdAmount: PropTypes.number.isRequired,
  highThresholdColor: PropTypes.string,
  lowThresholdColor: PropTypes.string,
};

Chart.defaultProps = {
  data: [],
  highThresholdColor: '#ed7d7d',
  lowThresholdColor: '#90ed7d',
};

export default Chart;
