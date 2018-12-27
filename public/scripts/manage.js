$(document).ready(function() {
  const url = window.location.href;
  const pollId = url.substring(url.lastIndexOf('/') + 1);

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
  // Set font defaults
  Chart.defaults.global.defaultFontFamily = "'Merriweather Sans', 'sans-serif'";
  Chart.defaults.global.defaultFontSize = 14;

  const ctx = document.getElementById('poll-results');

  // Find the total sum of all ranks
  const total = data.parsedRanks.reduce((acc, cur) => acc + cur);

  const labels = data.parsedChoices;
  const rankPercentages = data.parsedRanks.map(rank => {
    return ((rank / total) * 100).toFixed(2);
  });

  // Make the chart
  const rankChart = new Chart(ctx, {
    type: 'horizontalBar',

    data: {
      labels,
      datasets: [
        {
          label: 'Percentage',
          data: rankPercentages,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
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
        ]
      },
      legend: {
        display: false
      }
    }
  });
}
