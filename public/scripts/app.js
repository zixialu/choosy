$(function() {
  //Ajax POST request on form submit on main page.
  let $pollForm = $('#create-poll');

  // Submit form event
  $pollForm.submit(function(event) {
    console.log('Submit button clicked!');
    event.preventDefault();
    // TODO: create helper function to validate submission
    let formData = $pollForm.serialize();

    $.post('/', formData, function(data, status) {
      // console.log("data that comes back from post request", data);
      //   let pollId = ***;
      //   // TODO: figure out how to get pollID from data sent back by POST req
      //   // TODO: figure out how to hash pollID
      //   res.redirect('/manage/:pollId');
    });
  });

  /*
   * The next two event listeners watch for interaction with the last choice
   * input group, to add a new one or remove an empty one as needed. A new group
   * should be appended if the user begins to fill data into the last group, and
   * the last group should be removed if there is more than one empty group at
   * the bottom ready to be filled in (there should always be exactly one empty
   * group at the bottom of the form)
   */
  const $pollChoices = $('#poll-choices');

  $pollChoices.on('change', event => {
    // On change of last input group, make a new input group
    const $lastChoiceGroup = $pollChoices.children().last();

    // Check if title field is being filled in
    if (getTitleValue($lastChoiceGroup)) {
      // Append a new input group
      // TODO: Increment this number for every new input group
      $pollChoices.append(createChoiceGroup(1));
    }
  });

  $pollChoices.on('blur', event => {
    // TODO: On blur of last input group, remove all but one empty input group
    const $lastChoiceGroup = $pollChoices.children().last();
    if (!getTitleValue($lastChoiceGroup)) {
      // TODO: Remove all but one empty input group? Is this extra logic needed?
      $lastChoiceGroup.remove();
    }
  });
});

function getTitleValue(choiceGroup) {
  return choiceGroup
    .children('.choice-title')
    .first()
    .val();
}

function createChoiceGroup(number) {
  return `
    <div class="input-group">
      <span class="input-group-addon">
        <span class="glyphicon glyphicon-menu-right"></span>
      </span>
      <input
        type="text"
        class="form-control choice-title"
        name="title${number}"
        placeholder="Option"
      />
      <input
        type="text"
        class="form-control choice-description"
        name="desc${number}"
        placeholder="Description"
      />
    </div>
  `;
}

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
