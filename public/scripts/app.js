$(function() {
  //Ajax POST request on form submit on main page.
  let $pollForm = $('#create-poll');
  let $choices = $('#poll-choices');

  // Submit form event
  $pollForm.submit(function(event) {
    console.log('Submit button clicked!');
    event.preventDefault();
    // TODO: create helper function to validate submission

    // let formData = $pollForm.serialize();

    let formData = jQuery($pollForm).serializeArray();
    let parsedFormData = {};
    console.log('input', formData);
    formValidation(formData);

    function formValidation(data) {
      if (!data[0].value) {
        $('#form-alert .panel-body').text(
          'Please write a prompt for your poll'
        );
        console.log('Please write a prompt for your poll');
      } else if (!data[1].value) {
        $('form-alert .panel-body').text('Please insert a valid email address');
        console.log('Please insert a valid email address');
      } else {
        parsedFormData[data[0].name] = data[0].value;
        parsedFormData[data[1].name] = data[1].value;
        for (let counter = 2; counter < data.length; counter += 2) {
          if (data[counter].value) {
            parsedFormData[data[counter].name] = data[counter].value;
            parsedFormData[data[counter + 1].name] = data[counter + 1].value;
          }
        }
        if (parsedFormData.length <= 4) {
          $('#form-alert .panel-body').text(
            'Please create a poll with at least two options'
          );
        } else {
          console.log('parsed data', parsedFormData);
          let newData = JSON.stringify(parsedFormData);
          $.post('/', parsedFormData, function(data, status) {
            // console.log(data)// console.log("data that comes back from post request", data);
            //   let pollId = ***;
            //   // TODO: figure out how to get pollID from data sent back by POST req
            //   // TODO: figure out how to hash pollID
            //   res.redirect('/manage/:pollId');
          });
        }
      }
    }

    //
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
