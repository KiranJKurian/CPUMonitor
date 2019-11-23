import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = ({ data, highThresholdAmount }) => {
  const options = {
    title: {
      text: 'CPU Load Averages'
    },
    xAxis: {
      categories: data.map(({ datetime }) => datetime.toLocaleTimeString()),
      title: {
        text: 'Time'
      }
    },
    yAxis: {
      title: {
        text: 'Load'
      }
    },
    series: [
      {
        name: 'Load',
        type: 'area',
        data: data.map(({ load, datetime }) => ({
          y: load,
          name: new Date(datetime)
        })),
        zones: [
          {
            color: '#90ed7d',
            value: highThresholdAmount
          },
          {
            color: '#ed7d7d'
          }
        ]
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      load: PropTypes.number,
      datetime: PropTypes.instanceOf(Date)
    })
  ),
  highThresholdAmount: PropTypes.number.isRequired
};

Chart.defaultProps = {
  data: []
};

export default Chart;
