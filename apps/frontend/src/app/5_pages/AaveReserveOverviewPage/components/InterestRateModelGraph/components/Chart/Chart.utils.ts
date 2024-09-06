import { RatesData } from './Chart.types';

const getOrCreateLegendList = id => {
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
  u: number,
  base: number,
  optimal: number,
  slope1: number,
  slope2: number,
) => {
  if (u === 0) return 0;

  if (u <= optimal) return base + (u / optimal) * slope1;

  return base + slope1 + ((u - optimal) / (1 - optimal)) * slope2;
};

export const calculateVariableInterestRateModel = (
  u: number,
  rates: RatesData,
) => {
  const base = parseFloat(rates.baseVariableBorrowRate);
  const optimal = parseFloat(rates.optimalUsageRatio);
  const slope1 = parseFloat(rates.variableRateSlope1);
  const slope2 = parseFloat(rates.variableRateSlope2);

  return calculateInterestRateModel(u, base, optimal, slope1, slope2);
};
