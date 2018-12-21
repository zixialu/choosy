

$(document).ready(function() {
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
})
