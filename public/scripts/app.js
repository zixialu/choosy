$(() => {
  // $.ajax({
  //   method: 'GET',
  //   url: '/api/users'
  // }).done(users => {
  //   for (user of users) {
  //     $('<div>')
  //       .text(user.name)
  //       .appendTo($('body'));
  //   }
  // });

  // Drag and drop list
  $('#sortable').sortable({
    // axis: 'y',
    containment: 'parent',
    cursor: 'move',
    distance: 5,
    revert: true,
    tolerance: 'pointer'
  });
  // $('#sortable').disableSelection();
});
