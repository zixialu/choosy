$(document).ready(function() {

  //Ajax POST request on form submit on main page.
  let $newpoll = $('#create-poll'); //important: confirm id against html file
  $newpoll.submit(function (event) {
    console.log('Button clicked!');
    event.preventDefault();
    //TO DO: create helper function to validate submission
    let formData = $newpoll.serialize();

    console.log(formData);

    // $.post('/', formData, function (data, status) {
    //   let pollId = ***;
    //   //TO DO: figure out how to get pollID from data sent back by POST req
    //   //TO DO: figure out how to hash pollID
    //   res.redirect('/manage/:pollId');
    // });
  })
})


//   // Drag and drop list
//   $('#sortable').sortable({
//     // axis: 'y',
//     containment: 'parent',
//     cursor: 'move',
//     distance: 5,
//     // This blocks arranging while it drifts; remove for UX reasons?
//     // revert: true,
//     // This can get buggy if elements are different sizes
//     tolerance: 'pointer'
//   });
//   $('#sortable').disableSelection();
// })

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
//

