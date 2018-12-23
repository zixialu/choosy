

$(document).ready(function() {

//TO DO: figure out how to retrieve pollId from rendered page
//(being passed in as a variable on render)
//i.e. do we pass the ID in here to the function as a variable?
const url = window.location.href;
const pollId = url.substring(url.lastIndexOf('/') + 1);

$.ajax({
    type: 'get',
    url: `/manage/api/${pollId}`,
    success: function(data) {
      console.log('here is the data', data)
      $("section.jumbotron").prepend(`<h1>${data.parsedPrompt}</h1>`)
      createChart(data)
    },
    // complete: function() {
    //   setTimeout(requestRepeater(id), 5000);
    // }
  });


})


function requestRepeater(id) {

}

function createChart(data) {
  var ctx = document.getElementById("myChart");
  let labels = data.parsedChoices
  let dataInput = data.parsedRanks
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: '# of Votes',
              data: dataInput,
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
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}
