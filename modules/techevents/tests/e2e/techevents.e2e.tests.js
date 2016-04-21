'use strict';

describe('TechEvents E2E Tests:', function () {
  describe('Test techEvents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/techEvents');
      expect(element.all(by.repeater('techEvent in techEvents')).count()).toEqual(0);
    });
  });
});
