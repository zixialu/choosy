

$(document).ready(function() {

//TO DO: figure out how to retrieve pollId from rendered page
//(being passed in as a variable on render)
//i.e. do we pass the ID in here to the function as a variable?
requestRepeater();



})



function requestRepeater() {
  $.ajax({
    type: 'get',
    url: '/manage/api/:id',
    success: function(data) {
    // insert what we want it to do with the data that it gets back
    // (e.g. add jquery append, etc.)
    },
    complete: function() {
      setTimeout(requestRepeater, 5000);
    }
  });
}
