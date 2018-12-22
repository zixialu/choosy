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
   * The next event listener watch for interaction with the last choice input
   * group, to add a new one as needed. A new group
   * should be appended if the user begins to fill data into the last group
   * (there should always be at least one empty group at the bottom of the form)
   */
  const $pollChoices = $('#poll-choices');

  $pollChoices.on('keyup', event => {
    console.log('Poll choices on keyup');
    // On change of last input group, make a new input group
    const $lastChoiceGroup = $pollChoices.children().last();

    // Check if title field is being filled in
    if (getTitleValue($lastChoiceGroup)) {
      // Append a new input group
      $pollChoices.append(createChoiceGroup($pollChoices.children().length));
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
        placeholder="Description (optional)"
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
