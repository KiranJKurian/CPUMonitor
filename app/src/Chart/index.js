import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Chart = ({
  data,
}) => {
  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      type: 'area',
      data: data
    }]
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default Chart;