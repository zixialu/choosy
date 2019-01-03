$(document).ready(function() {
  const url = window.location.href;
  const pollId = url.substring(url.lastIndexOf('/') + 1);

  // Set up the copy link button
  const $copyButton = $('#copy-button');
  const clipboard = new ClipboardJS('#copy-button');

  // Set up the tooltip
  $copyButton.tooltip();

  // Copy success handler
  // Update the tooltip
  clipboard.on('success', e => {
    $copyButton
      .attr('title', 'Copied!')
      .tooltip('fixTitle')
      .tooltip('show');
  });

  // Keep a reference to the chart
  let rankChart;

  // Keep a reference to the interval timer
  let updateTimer;

  // Ajax request to get the poll data
  $.ajax({
    type: 'get',
    url: `/manage/api/${pollId}`,
    success: function(data) {
      // Set prompt header
      const $promptHeader = $('.poll-prompt');
      $promptHeader.text(data.parsedPrompt);

      rankChart = createChart(data);
    },
    error: function() {
      // Redirect to a 404 page on error
      console.log('404 redirect');
      location.href = '/404';
    },
    complete: function() {
      /*
       * FIXME: This does not work in IE9, use an anonymous function to pass
       * params instead. Refer to setInterval docs for more information.
       */
      if (!updateTimer) {
        updateTimer = setInterval(updateData, 5000, rankChart, pollId);
      }
    }
  });
});

function createChart(data) {
  const $chartCanvas = $('#poll-results');

  // Add the public link to the copy input
  const votePath = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ''
  }/vote/`;
  const publicLink = data.parsedPublicId;
  $('#copy-input').attr('value', votePath + publicLink);

  // Resize canvas to fit any number of options
  // These heights are just rough estimates
  const elementHeight = 50;
  const axisHeight = 100;
  $chartCanvas.prop(
    'height',
    data.parsedRanks.length * elementHeight + axisHeight
  );

  // Set font defaults
  Chart.defaults.global.defaultFontFamily = "'Merriweather Sans', 'sans-serif'";
  Chart.defaults.global.defaultFontSize = 14;

  // Find the total sum of all ranks
  const total = data.parsedRanks.reduce((acc, cur) => acc + cur);

  const labels = data.parsedChoices;
  const rankPercentages = data.parsedRanks.map(rank => {
    return ((rank / total) * 100).toFixed(2);
  });

  // Make the chart
  return new Chart($chartCanvas, {
    type: 'horizontalBar',

    data: {
      labels,
      datasets: [
        {
          label: '% Score',
          data: rankPercentages,
          backgroundColor: '#eb2f06b2',
          hoverBackgroundColor: '#eb2f06',
          borderColor: '#eb2f06',
          borderWidth: 1
        }
      ]
    },

    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              min: 0,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        ],

        yAxes: [
          {
            // This constrains bar width
            // maxBarThickness: 100,
            gridLines: {
              display: false
            }
          }
        ]
      },

      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',

        // The following is the chart.js default font color
        titleFontColor: '#666666',
        bodyFontColor: '#666666',
        displayColors: false,
        borderColor: 'rgba(231, 76, 60, 1.0)',
        borderWidth: 1
      }
    }
  });
}

// Update the poll results through ajax
function updateData(chart, id) {
  console.log('Updating chart...', Date());

  // Make an ajax request to get new data
  // TODO: Refactor this and the original ajax request to be more DRY
  $.ajax({
    type: 'get',
    url: `/manage/api/${id}`,
    success: function(data) {
      // Construct the new data
      // TODO: Refactor this and createChart() to be more DRY
      const total = data.parsedRanks.reduce((acc, cur) => acc + cur);
      const rankPercentages = data.parsedRanks.map(rank => {
        return ((rank / total) * 100).toFixed(2);
      });

      // Then, push the new data
      chart.data.datasets.forEach(dataset => {
        dataset.data = rankPercentages;
      });

      // Finally, update the chart
      chart.update();
    }
  });
}
