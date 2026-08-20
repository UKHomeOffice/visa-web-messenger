const { expect } = require('@playwright/test');

class VisaMessengerPage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.offlineBannerText = 'You are currently offline. Messages cannot be sent until reconnected to the internet.';
    this.onlineBannerText = 'You are now online. Messages can now be sent.';

    this.selectors = {
      acceptCookies: '#cookies-accept',
      rejectCookies: '#cookies-reject',
      hideCookiesMessage: '#hide-accept-message',
      viewCookiesLink: 'a:has-text("View cookies")',
      messageInput: '[data-testid="message-input"]',
      sendButton: '[data-testid="send-message-button"]',
      endChatButton: '[data-testid="end-chat-button"]',
      inboundMessageWrapper: '[data-testid="inbound-message-wrapper"]',
      outboundMessageWrapper: '[data-testid="outbound-message-wrapper"]',
      messageMetadata: '[data-testid="message-metadata"]',
      bannerMessage: '[data-testid="banner-message"]',
      endChatModal: '[data-testid="end-chat-modal"]',
      closeEndChatButton: '[data-testid="close-end-chat-modal-button"]',
      confirmEndChatButton: '[data-testid="confirm-end-chat-button"]',
      characterCounter: '[data-testid="character-counter"]'
    };

    this.lastOutboundCount = 0;
    this.lastInboundCountAfterRefresh = 0;
    this.sequentialMessageIndex = 0;
    this.sequentialPrefix = '';
  }

  async gotoHome() {
    await this.page.goto('/');
  }

  async gotoInvalidPath() {
    await this.page.goto('/invalid-path-for-visa');
  }

  async acceptCookies() {
    await this.page.locator(this.selectors.acceptCookies).click();
  }

  async rejectCookies() {
    await this.page.locator(this.selectors.rejectCookies).click();
  }

  async hideCookieAcceptance() {
    await this.page.locator(this.selectors.hideCookiesMessage).click();
  }

  async acceptCookiesIfVisible() {
    if (await this.page.locator(this.selectors.acceptCookies).count()) {
      await this.acceptCookies();
    }
  }

  async hideCookieAcceptanceIfVisible() {
    if (await this.page.locator(this.selectors.hideCookiesMessage).count()) {
      await this.hideCookieAcceptance();
    }
  }

  async sendMessage(message) {
    this.lastOutboundCount = await this.page.locator(this.selectors.outboundMessageWrapper).count();
    await this.expectChatInputVisible();
    await this.page.locator(this.selectors.messageInput).fill(message);
    await this.page.locator(this.selectors.sendButton).click();
  }

  async openEndChatDialog() {
    await this.page.locator(this.selectors.endChatButton).click();
  }

  async cancelEndChat() {
    await this.page.locator(this.selectors.closeEndChatButton).click();
  }

  async confirmEndChat() {
    await this.page.locator(this.selectors.confirmEndChatButton).click();
  }

  async fillInput(value) {
    await this.page.locator(this.selectors.messageInput).fill(value);
  }

  async typeInput(value) {
    await this.page.locator(this.selectors.messageInput).type(value);
  }

  async getInputValue() {
    return this.page.locator(this.selectors.messageInput).inputValue();
  }

  async openFooterAccessibility() {
    await this.page.getByTestId('footer-accessibilty-statement-link').click();
  }

  async openFooterCookies() {
    await this.page.getByTestId('footer-cookies-link').click();
  }

  async goBack() {
    await this.page.goBack();
  }

  async clickQuickReply(buttonText) {
    await this.page.getByRole('button', { name: buttonText, exact: true }).first().click();
  }

  async waitForChatReadyOrJourney() {
    const messageInput = this.page.locator(this.selectors.messageInput);
    const somethingElse = this.page.getByRole('button', { name: 'Something Else', exact: true }).first();

    await expect.poll(async () => {
      if (await somethingElse.isVisible().catch(() => false)) {
        return 'journey';
      }

      return await messageInput.isEnabled().catch(() => false) ? 'input' : 'waiting';
    }, {
      timeout: 30_000,
      intervals: [300, 600, 1000]
    }).toMatch(/input|journey/);

    if (await somethingElse.isVisible().catch(() => false)) {
      await somethingElse.click();
      const travelToTheUk = this.page.getByRole('button', { name: 'Travel To The UK', exact: true }).first();
      await expect(travelToTheUk).toBeVisible({ timeout: 30_000 });
      await travelToTheUk.click();

      await expect(messageInput).toBeEnabled({ timeout: 30_000 });
    }
  }

  async refresh() {
    await this.page.reload();
    await this.expectChatInputVisible();
    await expect(this.page.locator(this.selectors.messageInput)).toBeEnabled({ timeout: 30_000 });

    if (this.sequentialPrefix && this.sequentialMessageIndex > 0) {
      await expect(
        this.page.locator(this.selectors.inboundMessageWrapper).filter({
          hasText: `${this.sequentialPrefix} ${this.sequentialMessageIndex}`
        })
      ).toBeVisible({ timeout: 30_000 });
    }

    this.lastInboundCountAfterRefresh = await this.page.locator(this.selectors.inboundMessageWrapper).count();
  }

  async sendSequentialMessages(prefix, count) {
    this.sequentialPrefix = prefix;
    for (let index = 1; index <= count; index += 1) {
      const message = `${prefix} ${index}`;
      await this.sendMessage(message);
      await expect(this.page.locator(this.selectors.inboundMessageWrapper).filter({
        has: this.page.getByText(message, { exact: true })
      })).toBeVisible();

      this.sequentialMessageIndex = index;
    }

    await this.expectUserMessage(`${prefix} ${count}`);
  }

  async sendNextSequentialMessageAfterRefresh(prefix) {
    if (!this.sequentialPrefix) {
      this.sequentialPrefix = prefix;
    }

    const nextIndex = this.sequentialMessageIndex + 1;
    const nextMessage = `${this.sequentialPrefix} ${nextIndex}`;

    await this.sendMessage(nextMessage);
    await expect(this.page.locator(this.selectors.inboundMessageWrapper).filter({
      has: this.page.getByText(nextMessage, { exact: true })
    })).toBeVisible();
    this.sequentialMessageIndex = nextIndex;
  }

  async expectMessengerHeading() {
    await expect(this.page.getByRole('heading', { name: 'Home Office UK Visas and Immigration Chat' })).toBeVisible();
  }

  async expectFeedbackLink() {
    const feedbackLink = this.page.getByRole('link', { name: 'give your feedback (opens in new tab)' });
    await expect(feedbackLink).toBeVisible();
    await expect(feedbackLink).toHaveAttribute('href', 'https://ukhomeoffice.qualtrics.com/jfe/form/SV_ehDrH6eJrtGBFMW');
    await expect(feedbackLink).toHaveAttribute('target', '_blank');
  }

  async expectCookieActionButtonsVisible() {
    await expect(this.page.locator(this.selectors.acceptCookies)).toBeVisible();
    await expect(this.page.locator(this.selectors.rejectCookies)).toBeVisible();
    await expect(this.page.locator(this.selectors.viewCookiesLink)).toBeVisible();
  }

  async expectCookieActionButtonsHidden() {
    await expect(this.page.locator(this.selectors.acceptCookies)).toHaveCount(0);
    await expect(this.page.locator(this.selectors.rejectCookies)).toHaveCount(0);
  }

  async expectHideCookieMessageVisible() {
    await expect(this.page.locator(this.selectors.hideCookiesMessage)).toBeVisible();
  }

  async expectHideCookieMessageHidden() {
    await expect(this.page.locator(this.selectors.hideCookiesMessage)).toHaveCount(0);
  }

  async expectNotFoundHeading() {
    await expect(this.page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  }

  async expectChatControls() {
    await this.expectChatInputVisible();
    await expect(this.page.locator(this.selectors.sendButton)).toBeVisible();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeVisible();
  }

  async expectChatControlsEnabled() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeEnabled();
    await expect(this.page.locator(this.selectors.sendButton)).toBeEnabled();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeEnabled();
  }

  async expectChatControlsDisabled() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeDisabled();
    await expect(this.page.locator(this.selectors.sendButton)).toBeDisabled();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeDisabled();
  }

  async expectChatInputVisible() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeVisible();
  }

  async expectUserMessage(message) {
    await expect(this.page.locator(this.selectors.inboundMessageWrapper).filter({ hasText: message }).first()).toBeVisible();
  }

  async expectUserMessageHidden(message) {
    await expect(this.page.locator(this.selectors.inboundMessageWrapper).filter({ hasText: message })).toHaveCount(0);
  }

  async expectLatestMetaPrefix(prefix) {
    const metadata = this.page.locator(this.selectors.messageMetadata).filter({ hasText: prefix });
    await expect(metadata.first()).toBeVisible();
    await expect(metadata.first()).toContainText(/\d{2}:\d{2}/);
  }

  async expectOneMoreInboundMessage() {
    await expect.poll(async () => {
      return this.page.locator(this.selectors.outboundMessageWrapper).count();
    }, {
      timeout: 30_000,
      intervals: [500, 1000, 2000]
    }).toBeGreaterThan(this.lastOutboundCount);
  }

  async expectEndChatConfirmationControls() {
    await expect(this.page.locator(this.selectors.endChatModal)).toBeVisible();
    await expect(this.page.getByTestId('end-chat-modal-heading')).toContainText('Do you want to end the chat?');
    await expect(this.page.getByRole('button', { name: 'Yes, end chat' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'No, keep chatting' })).toBeVisible();
  }

  async expectChatEndedPage() {
    await expect(this.page.getByRole('heading', { name: 'Your chat has ended' })).toBeVisible();
  }

  async expectCharacterCounter(text) {
    await expect(this.page.locator(this.selectors.characterCounter)).toContainText(text);
  }

  async expectAccessibilityStatement() {
    await expect(this.page).toHaveURL(/\/accessibility$/);
    await expect(this.page.getByRole('heading', { name: 'Accessibility statement for Visa' })).toBeVisible();
  }

  async setOffline() {
    await this.context.setOffline(true);
  }

  async expectOfflineBanner() {
    await expect(this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.offlineBannerText }).first()).toBeVisible();
  }

  async reconnectWithRetry() {
    let reconnected = false;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await this.context.setOffline(false);

      try {
        await expect.poll(async () => {
          return this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.onlineBannerText }).count();
        }, {
          timeout: 10_000
        }).toBeGreaterThan(0);

        reconnected = true;
        break;
      } catch {
        await this.context.setOffline(true);
        await this.expectOfflineBanner();
      }
    }

    expect(reconnected).toBe(true);
  }

  async expectOnlineBanner() {
    await expect(this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.onlineBannerText }).first()).toBeVisible();
  }

  async expectCookiesPage() {
    await expect(this.page).toHaveURL(/\/cookies$/);
    await expect(this.page.getByRole('heading', { name: 'Cookies', exact: true })).toBeVisible();
  }

  async expectQuickReplyButtons(labels) {
    for (const label of labels) {
      await expect(this.page.getByRole('button', { name: label, exact: true }).first()).toBeVisible();
    }
  }

  async expectAssistantMessageContaining(text) {
    await expect(this.page.locator(this.selectors.outboundMessageWrapper).filter({ hasText: text }).first()).toBeVisible();
  }

  async expectInboundAfterRefresh() {
    await expect.poll(async () => {
      return this.page.locator(this.selectors.inboundMessageWrapper).count();
    }, {
      timeout: 20_000,
      intervals: [500, 1000, 2000]
    }).toBeGreaterThan(this.lastInboundCountAfterRefresh);

    await this.expectUserMessage(`${this.sequentialPrefix} ${this.sequentialMessageIndex}`);
  }

  async expectOlderHistoryFetched() {
    const chatMessages = this.page.locator('.chat-messages');
    const firstMessage = this.page.locator(this.selectors.inboundMessageWrapper).filter({
      has: this.page.getByText(`${this.sequentialPrefix} 1`, { exact: true })
    });

    await expect.poll(async () => {
      if (await firstMessage.count() > 0) {
        return 1;
      }

      await chatMessages.evaluate((el) => {
        el.scrollTop = 24;
        el.dispatchEvent(new Event('scroll', { bubbles: true }));
        el.scrollTop = 0;
        el.dispatchEvent(new Event('scroll', { bubbles: true }));
      });

      return await firstMessage.count();
    }, {
      timeout: 30_000,
      intervals: [500]
    }).toBeGreaterThan(0);

    await firstMessage.evaluate((message) => {
      const container = message.closest('.chat-messages');
      const offset = message.getBoundingClientRect().top - container.getBoundingClientRect().top;
      container.scrollTop += offset;
      container.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
  }

  async expectTopInboundMessage(expectedMessage) {
    const expected = this.page.locator(this.selectors.inboundMessageWrapper).filter({
      has: this.page.getByText(expectedMessage, { exact: true })
    });

    await expect(expected).toBeVisible();
    await expect.poll(async () => expected.evaluate((message) => {
      const container = message.closest('.chat-messages');
      return Math.abs(message.getBoundingClientRect().top - container.getBoundingClientRect().top);
    })).toBeLessThanOrEqual(2);
  }
}

module.exports = {
  VisaMessengerPage
};
