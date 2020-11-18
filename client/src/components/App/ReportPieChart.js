import React from 'react';
import { VictoryLabel, VictoryPie } from 'victory';

const ReportPieChart = ({ chartData, clientName }) => {
  let formattedChartData = [];
  for (const key in chartData) {
    if (chartData.hasOwnProperty(key)) {
      formattedChartData.push({ x: chartData[key], y: chartData[key], label: key + ': ' + chartData[key] });
    }
  }

  return (
    <div>
      <svg viewBox="0 0 400 400" style={{ overflow: 'visible' }}>
        <VictoryPie
          standalone={false}
          width={400} height={400}
          data={formattedChartData}
          innerRadius={68} labelRadius={170}
          colorScale="qualitative"
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 20 }}
          x={200} y={200}
          text={clientName}
        />
      </svg>
    </div>
  );
};

export default ReportPieChart;
