const { test: base, createBdd } = require('playwright-bdd');
const { VisaMessengerPage } = require('../pages/visa-messenger-page');

const test = base.extend({
  visaPage: async ({ page, context }, applyFixture) => {
    const visaPage = new VisaMessengerPage(page, context);
    await applyFixture(visaPage);
  }
});

const { Given, When, Then } = createBdd(test);

module.exports = {
  test,
  Given,
  When,
  Then
};
