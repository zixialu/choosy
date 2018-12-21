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
    // This blocks dragging while it drifts into place; remove for UX reasons?
    // revert: true,
    // This can get buggy if elements are different sizes
    tolerance: 'pointer'
  });
  $('#sortable').disableSelection();

  //Submit vote
  const $submitVote = $('#submit-vote');

  // FIXME: Remove this when page is made dynamic; this is placeholder data
  $submitVote.data('pollId', 1234);
  $('#sortable')
    .children()[0]
    .data('choiceId', 1);
  $('#sortable')
    .children()[1]
    .data('choiceId', 2);
  $('#sortable')
    .children()[2]
    .data('choiceId', 3);

  $submitVote.on('click', () => {
    // TODO: Form the ajax body
    // pollId
    // TODO: put the pollId into submit's data tag when page is loaded
    const pollId = $submitVote.data('pollId');
    // pollChoices { rank, choiceId }
    // TODO: Make the route and ajax request to submit the vote
    const $choiceElements = $('#sortable').children();
    const pollChoices = [];
    $choiceElements.forEach((choice, index) => {
      pollChoices.push({
        // TODO: Add data tags to each choice <li> holding choiceId on page load
        choiceId: $(choice).data(choiceId),
        // FIXME: Reverse this number, maybe? Depending on how we process this?
        rank: index
      });
    });
  });
});
