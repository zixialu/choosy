$(document).ready(function() {

  //Ajax POST request on form submit on vote page.
  let $votepoll = $('#vote-button');
  $votepoll.submit(function (event) {
    console.log('Button clicked!');
    event.preventDefault();
    let voteFormData = $votepoll.serialize();

  })

})
