import { Decimal } from '@sovryn/utils';

import { RatesData } from './Chart.types';

const getOrCreateLegendList = (id: string) => {
  const legendContainer = document.getElementById(id);
  if (!legendContainer) {
    return;
  }
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = '0';
    listContainer.style.padding = '0';

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(
      options.containerID || 'legend-container-interest-chart',
    );
    if (!ul) {
      return;
    }

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach(item => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';

      li.onclick = () => {
        const { type } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex),
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = '0';
      boxSpan.style.height = '10px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '10px';

      // Text
      const textContainer = document.createElement('p');
      //textContainer.style.color = item.fontColor;
      textContainer.style.margin = '0';
      textContainer.style.padding = '0';
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
      textContainer.style.color = 'f5f5f5';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.className = 'mb-2';
      ul.appendChild(li);
    });
  },
};

export const calculateInterestRateModel = (
  utilization: number,
  baseRate: Decimal,
  optimalUtilization: Decimal,
  initialSlope: Decimal,
  secondarySlope: Decimal,
): Decimal => {
  if (utilization === 0) {
    return Decimal.ZERO;
  }

  const utilizationDecimal = Decimal.from(utilization);

  if (utilizationDecimal.lte(optimalUtilization)) {
    return baseRate.add(
      utilizationDecimal.div(optimalUtilization).mul(initialSlope),
    );
  }

  return baseRate
    .add(initialSlope)
    .add(
      utilizationDecimal
        .sub(optimalUtilization)
        .div(Decimal.from(1).sub(optimalUtilization))
        .mul(secondarySlope),
    );
};

export const calculateVariableInterestRateModel = (
  utilization: number,
  rates: RatesData,
) => {
  const baseRate = rates.baseVariableBorrowRate;
  const optimalUtilization = rates.optimalUsageRatio;
  const initialSlope = rates.variableRateSlope1;
  const secondarySlope = rates.variableRateSlope2;

  return calculateInterestRateModel(
    utilization,
    baseRate,
    optimalUtilization,
    initialSlope,
    secondarySlope,
  );
};
