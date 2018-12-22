$(function() {
  //Ajax POST request on form submit on main page.
  let $newpoll = $('#create-poll'); //important: confirm id against html file
  $newpoll.submit(function(event) {
    console.log('Button clicked!');
    event.preventDefault();
    //TO DO: create helper function to validate submission
    let formData = $newpoll.serialize();

    $.post('/', formData, function(data, status) {
      // console.log("data that comes back from post request", data);
      //   let pollId = ***;
      //   //TO DO: figure out how to get pollID from data sent back by POST req
      //   //TO DO: figure out how to hash pollID
      //   res.redirect('/manage/:pollId');
    });
  });

  console.log('Test');
});

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
