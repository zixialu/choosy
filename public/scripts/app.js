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
    // This blocks arranging while it drifts; remove for UX reasons?
    // revert: true,
    // This can get buggy if elements are different sizes
    tolerance: 'pointer'
  });
  $('#sortable').disableSelection();
});
