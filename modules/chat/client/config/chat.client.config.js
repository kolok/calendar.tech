'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    //FIXME: to activate the Chat, uncomment these lines
/*    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
*/
  }
]);
