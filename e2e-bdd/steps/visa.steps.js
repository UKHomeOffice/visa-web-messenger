const { expect } = require('@playwright/test');
const { Given, Then, When } = require('./bdd-fixtures');

Given('I open the VISA web messenger', async ({ visaPage }) => {
  await visaPage.gotoHome();
});

Given('I open an invalid VISA page', async ({ visaPage }) => {
  await visaPage.gotoInvalidPath();
});

Given('I dismiss cookies by accepting', async ({ visaPage }) => {
  await visaPage.acceptCookiesIfVisible();
  await visaPage.hideCookieAcceptanceIfVisible();
});

When('I accept analytics cookies', async ({ visaPage }) => {
  await visaPage.acceptCookies();
});

When('I reject analytics cookies', async ({ visaPage }) => {
  await visaPage.rejectCookies();
});

When('I hide the cookie acceptance message', async ({ visaPage }) => {
  await visaPage.hideCookieAcceptance();
});

When('I send the message {string}', async ({ visaPage }, message) => {
  await visaPage.sendMessage(message);
});

When('I open the end chat dialog', async ({ visaPage }) => {
  await visaPage.openEndChatDialog();
});

When('I choose to keep chatting', async ({ visaPage }) => {
  await visaPage.cancelEndChat();
});

When('I confirm ending the chat', async ({ visaPage }) => {
  await visaPage.confirmEndChat();
});

When('I fill the input with 4096 characters of {string}', async ({ visaPage }, char) => {
  await visaPage.fillInput(char.repeat(4096));
});

When('I type one more character {string}', async ({ visaPage }, char) => {
  await visaPage.typeInput(char);
});

When('I open the accessibility statement from the footer', async ({ visaPage }) => {
  await visaPage.openFooterAccessibility();
});

When('I open the cookies page from the footer', async ({ visaPage }) => {
  await visaPage.openFooterCookies();
});

When('I navigate back in the browser', async ({ visaPage }) => {
  await visaPage.goBack();
});

When('I click the quick reply button {string}', async ({ visaPage }, buttonText) => {
  await visaPage.clickQuickReply(buttonText);
});

When('I send {int} sequential messages with prefix {string}', async ({ visaPage }, count, prefix) => {
  await visaPage.sendSequentialMessages(prefix, count);
});

When('I refresh the page', async ({ visaPage }) => {
  await visaPage.refresh();
});

When('I send the next sequential message with prefix {string}', async ({ visaPage }, prefix) => {
  await visaPage.sendNextSequentialMessageAfterRefresh(prefix);
});

Then('I should see the VISA messenger heading', async ({ visaPage }) => {
  await visaPage.expectMessengerHeading();
});

Then('I should see cookie banner action controls', async ({ visaPage }) => {
  await visaPage.expectCookieActionButtonsVisible();
});

Then('cookie action buttons should no longer be visible', async ({ visaPage }) => {
  await visaPage.expectCookieActionButtonsHidden();
});

Then('I should see the hide cookie message button', async ({ visaPage }) => {
  await visaPage.expectHideCookieMessageVisible();
});

Then('I should not see the hide cookie message button', async ({ visaPage }) => {
  await visaPage.expectHideCookieMessageHidden();
});

Then('I should see the page not found heading', async ({ visaPage }) => {
  await visaPage.expectNotFoundHeading();
});

Then('I should see chat controls', async ({ visaPage }) => {
  await visaPage.expectChatControls();
});

Then('I should see chat input', async ({ visaPage }) => {
  await visaPage.expectChatInputVisible();
});

Then('I should see my message {string}', async ({ visaPage }, message) => {
  await visaPage.expectUserMessage(message);
});

Then('I should not see my message {string}', async ({ visaPage }, message) => {
  await visaPage.expectUserMessageHidden(message);
});

Then('I should see message metadata prefixed with {string}', async ({ visaPage }, prefix) => {
  await visaPage.expectLatestMetaPrefix(prefix);
});

Then('I should receive one more assistant response', async ({ visaPage }) => {
  await visaPage.expectOneMoreInboundMessage();
});

Then('I should see end chat confirmation controls', async ({ visaPage }) => {
  await visaPage.expectEndChatConfirmationControls();
});

Then('I should see the chat ended page', async ({ visaPage }) => {
  await visaPage.expectChatEndedPage();
});

Then('I should see character counter text {string}', async ({ visaPage }, text) => {
  await visaPage.expectCharacterCounter(text);
});

Then('the input should be clamped to 4096 characters of {string}', async ({ visaPage }, char) => {
  const expected = char.repeat(4096);
  await expect(await visaPage.getInputValue()).toBe(expected);
});

Then('I should see the VISA accessibility statement', async ({ visaPage }) => {
  await visaPage.expectAccessibilityStatement();
});

Then('chat controls should be enabled', async ({ visaPage }) => {
  await visaPage.expectChatControlsEnabled();
});

When('I set network offline', async ({ visaPage }) => {
  await visaPage.setOffline();
});

Then('I should see the offline banner', async ({ visaPage }) => {
  await visaPage.expectOfflineBanner();
});

Then('chat controls should be disabled', async ({ visaPage }) => {
  await visaPage.expectChatControlsDisabled();
});

When('I reconnect network with retry', async ({ visaPage }) => {
  await visaPage.reconnectWithRetry();
});

Then('I should see the online banner', async ({ visaPage }) => {
  await visaPage.expectOnlineBanner();
});

Then('I should see the cookies page', async ({ visaPage }) => {
  await visaPage.expectCookiesPage();
});

Then('I should see the following quick reply buttons', async ({ visaPage }, dataTable) => {
  const labels = dataTable.raw().map(([value]) => value.trim());
  await visaPage.expectQuickReplyButtons(labels);
});

Then('I should see the assistant message containing {string}', async ({ visaPage }, expectedText) => {
  await visaPage.expectAssistantMessageContaining(expectedText);
});

Then('I should observe one more inbound message after refresh', async ({ visaPage }) => {
  await visaPage.expectInboundAfterRefresh();
});

Then('I should be able to fetch older history by scrolling to top', async ({ visaPage }) => {
  await visaPage.expectOlderHistoryFetched();
});

Then('the top message should be {string}', async ({ visaPage }, expectedMessage) => {
  await visaPage.expectTopInboundMessage(expectedMessage);
});
