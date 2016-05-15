'use strict';

// Configuring the TechEvents module
angular.module('techEvents').run(['Menus',
  function (Menus) {
    // Add the techEvents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'TechEvents',
      state: 'techEvents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'techEvents', {
      title: 'Calendar',
      state: 'techEvents.calendar'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'techEvents', {
      title: 'List TechEvents',
      state: 'techEvents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'techEvents', {
      title: 'Create TechEvents',
      state: 'techEvents.create',
      roles: ['user']
    });
  }
]);
