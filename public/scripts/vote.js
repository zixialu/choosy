$(document).ready(function() {
  //Ajax POST request on form submit on vote page.
  let $votepoll = $('#vote-button');
  $votepoll.submit(function(event) {
    console.log('Button clicked!');
    event.preventDefault();
    let voteFormData = $votepoll.serialize();
  });

  // Drag and drop list
  $('#sortable').sortable({
    // axis: 'y',
    containment: 'parent',
    cursor: 'move',
    distance: 5,
    // This blocks arranging while it drifts; remove for UX reasons?
    // revert: true,
    // This can get buggy if elements are different sizes
    tolerance: 'pointer'
  });
  $('#sortable').disableSelection();
});
