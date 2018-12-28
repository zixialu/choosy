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

  // Ajax request to get the poll data
  $.ajax({
    type: 'get',
    url: `/manage/api/${pollId}`,
    success: function(data) {
      // Set prompt header
      const $promptHeader = $('.poll-prompt');
      $promptHeader.text(data.parsedPrompt);

      createChart(data);
    }
    // complete: function() {
    //   setTimeout(updateData(id), 5000);
    // }
  });
});

function updateData(id) {
  // TODO: Use chart.js.update() and another ajax request to update the poll results
}

function createChart(data) {
  const $chartCanvas = $('#poll-results');

  // Add the public link to the copy input
  // TODO: Change this for heroku
  const votePath = 'http://localhost:8080/vote/';
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
  const rankChart = new Chart($chartCanvas, {
    type: 'horizontalBar',

    data: {
      labels,
      datasets: [
        {
          label: '% Score',
          data: rankPercentages,
          backgroundColor: 'rgba(231, 76, 60, 0.7)',
          hoverBackgroundColor: 'rgba(231, 76, 60, 1.0)',
          borderColor: 'rgba(231, 76, 60, 1.0)',
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
