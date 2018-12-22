

$(document).ready(function() {

//TO DO: figure out how to retrieve pollId from rendered page
//(being passed in as a variable on render)
//i.e. do we pass the ID in here to the function as a variable?
let pollId = req.params.id;
setTimeout(requestRepeater(pollId), 5000);



})



function requestRepeater(id) {
  $.ajax({
    type: 'get',
    url: '/manage/api/:id',
    success: function(data) {
    // insert what we want it to do with the data that it gets back
    // (e.g. add jquery append, etc.)
    },
    complete: function() {
      setTimeout(requestRepeater(id), 5000);
    }
  });
}
