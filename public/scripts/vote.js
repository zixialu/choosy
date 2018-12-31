$(document).ready(function() {
  // Make an ajax request to /vote/api to get the poll data
  const url = window.location.href;
  const publicId = url.substring(url.lastIndexOf('/') + 1);
  $.get(`/vote/api/${publicId}`, res => {
    // TODO: Insert data into page
    populatePrompt(res.prompt);
    res.pollChoices.forEach(choice => {
      appendChoice(choice);
    });
  });

  function populatePrompt(prompt) {
    const $pollPrompt = $('.poll-prompt');
    $pollPrompt.text(prompt);
  }

  function appendChoice(choice) {
    const rawHTML = `
      <li class="list-group-item ui-state-default">
        <h4>${choice.title}</h4>
        <section>${choice.description}</section>
      </li>
      `;
    const $newElement = $($.parseHTML(rawHTML));
    $newElement.data('choiceId', choice.id);

    const $unorderedList = $('#sortable');
    $unorderedList.append($newElement);
  }

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
  $submitVote.on('click', () => {
    // Form the AJAX body
    // Construct the data to submit
    const choiceElements = $('#sortable')
      .children()
      .toArray();
    const numberOfChoices = choiceElements.length;
    const pollChoices = [];
    choiceElements.forEach((choice, index) => {
      pollChoices.push({
        choiceId: $(choice).data('choiceId'),
        rank: numberOfChoices - index
      });
    });

    // TODO: Validation
    // TODO: Serialize the data?
    $.ajax({
      method: 'PUT',
      url: `/vote/${publicId}`,
      data: { pollChoices: JSON.stringify(pollChoices) },
      error: function() {
        // TODO: Redirect to a 404 page
        location.href = '/';
      }
    }).done(() => {
      location.href = '/vote/done';
    });
  });
});
