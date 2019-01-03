$(document).ready(function() {
  // Make an ajax request to /poll/api to get the poll data
  const url = window.location.href;
  const publicId = url.substring(url.lastIndexOf('/') + 1);
  $.get(`/poll/api/${publicId}`, res => {
    // Insert data into page
    populatePrompt(res.prompt);
    res.pollChoices.forEach(choice => {
      appendChoice(choice);
    });
  }).fail(err => {
    // Redirect to a 404 page on fail
    console.log('error 404 redirect');
    location.href = '/404';
  });

  function populatePrompt(prompt) {
    const $pollPrompt = $('.poll-prompt');
    $pollPrompt.text(prompt);
  }

  function appendChoice(choice) {
    const rawHTML = `
      <li class="list-group-item ui-state-default">
        <i class="material-icons md-36 md-dark">drag_handle</i>
        <span>
          <h4>${choice.title}</h4>
          <section>${choice.description}</section>
        </span>
      </li>
      `;
    const $newElement = $($.parseHTML(rawHTML));
    $newElement.data('choiceId', choice.id);

    const $unorderedList = $('#sortable');
    $unorderedList.append($newElement);
  }

  // Drag and drop list
  $('#sortable').sortable({
    containment: 'parent',
    cursor: 'move',
    distance: 5,

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

    $.ajax({
      method: 'PUT',
      url: `/poll/${publicId}`,
      data: { pollChoices: JSON.stringify(pollChoices) }
    }).done(() => {
      location.href = '/poll/done';
    });
  });
});
