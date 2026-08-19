@VisaWebMessenger
Feature: VISA web messenger core and guided journeys
  As a user of the UK Visas and Immigration chat service
  I want reliable web messenger behavior
  So that I can complete common chat journeys and navigation paths

  Scenario: Accept analytics cookies flow
    Given I open the VISA web messenger
    Then I should see the VISA messenger heading
    And I should see cookie banner action controls
    When I accept analytics cookies
    Then cookie action buttons should no longer be visible
    And I should see the hide cookie message button
    When I hide the cookie acceptance message
    Then I should not see the hide cookie message button

  Scenario: Reject analytics cookies flow
    Given I open the VISA web messenger
    Then I should see the VISA messenger heading
    And I should see cookie banner action controls
    When I reject analytics cookies
    Then cookie action buttons should no longer be visible
    And I should see the hide cookie message button
    When I hide the cookie acceptance message
    Then I should not see the hide cookie message button

  Scenario: Invalid page returns not found
    Given I open an invalid VISA page
    When I accept analytics cookies
    And I hide the cookie acceptance message
    Then I should see the page not found heading

  Scenario: Look and feel, message exchange, and end chat flow
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    Then I should see chat controls
    When I click the quick reply button "Something Else"
    And I click the quick reply button "Travel To The UK"
    When I send the message "Hello"
    Then I should see my message "Hello"
    And I should see message metadata prefixed with "You at"
    And I should receive one more assistant response
    And I should see message metadata prefixed with "Digital assistant at"
    When I send the message "Can you assist me with my VISA"
    Then I should see my message "Can you assist me with my VISA"
    And I should see message metadata prefixed with "You at"
    And I should receive one more assistant response
    And I should see message metadata prefixed with "Digital assistant at"
    When I open the end chat dialog
    Then I should see end chat confirmation controls
    When I choose to keep chatting
    Then I should see my message "Hello"
    And I should see my message "Can you assist me with my VISA"
    When I open the end chat dialog
    And I confirm ending the chat
    Then I should see the chat ended page
    And I should not see my message "Hello"
    And I should not see my message "Can you assist me with my VISA"

  Scenario: Character limit flow
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    Then I should see chat controls
    When I fill the input with 4096 characters of "a"
    Then I should see character counter text "0 characters left"
    When I type one more character "b"
    Then the input should be clamped to 4096 characters of "a"
    And I should see character counter text "0 characters left"

  Scenario: Open accessibility statement from start page
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I open the accessibility statement from the footer
    Then I should see the VISA accessibility statement

  Scenario: Navigate to cookies page and back to chat
    Given I open the VISA web messenger
    When I open the cookies page from the footer
    Then I should see the cookies page
    When I navigate back in the browser
    Then I should see chat input

  Scenario: Initial quick reply options are displayed
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    Then I should see the following quick reply buttons
      | Work                      |
      | Study                     |
      | Visits                    |
      | Settlement                |
      | eVisa                     |
      | British National Overseas |
      | Marriage and Family       |
      | Ukraine                   |
      | Something Else            |

  Scenario: Work journey with yes continuation
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Work"
    Then I should see the following quick reply buttons
      | Outside the UK |
      | Within the UK  |
    When I click the quick reply button "Outside the UK"
    Then I should see the following quick reply buttons
      | About Skilled Worker Visa |
      | Eligibility               |
      | How To Apply              |
      | Post Decision             |
      | Sponsor a Skilled Worker  |
      | eVisa Issue               |
      | Visa Application In Progress |
      | Something Else            |
    When I click the quick reply button "About Skilled Worker Visa"
    Then I should see the following quick reply buttons
      | Yes |
      | No  |
    When I click the quick reply button "Yes"
    Then I should see the assistant message containing "How can we help you today? Please enter your query"

  Scenario: Work journey with no continuation
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Work"
    And I click the quick reply button "Outside the UK"
    And I click the quick reply button "About Skilled Worker Visa"
    Then I should see the following quick reply buttons
      | Yes |
      | No  |
    When I click the quick reply button "No"
    Then I should see the assistant message containing "We hope you"

  Scenario: Study journey with yes continuation
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Study"
    Then I should see the following quick reply buttons
      | Outside the UK |
      | Within the UK  |
    When I click the quick reply button "Outside the UK"
    Then I should see the following quick reply buttons
      | About Student Visa |
      | Eligibility |
      | How To Apply |
      | Post Decision |
      | About Graduate Visa |
      | Sponsor a Student |
      | eVisa Issue |
      | Visa Application In Progress |
      | Something Else |
    When I click the quick reply button "About Student Visa"
    Then I should see the following quick reply buttons
      | Yes |
      | No  |
    When I click the quick reply button "Yes"
    Then I should see the assistant message containing "How can we help you today? Please enter your query"

  Scenario: Study journey with no continuation
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Study"
    And I click the quick reply button "Outside the UK"
    And I click the quick reply button "About Student Visa"
    Then I should see the following quick reply buttons
      | Yes |
      | No  |
    When I click the quick reply button "No"
    Then I should see the assistant message containing "survey"

  Scenario: Study journey negative path with free-text responses
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Study"
    And I click the quick reply button "Outside the UK"
    And I click the quick reply button "About Student Visa"
    Then I should see the following quick reply buttons
      | Yes |
      | No  |
    When I click the quick reply button "Yes"
    Then I should see the assistant message containing "How can we help you today? Please enter your query"
    When I send the message "User First Message"
    Then I should see the assistant message containing "I’m sorry I didn’t understand your question. Please rephrase the question and ask me again"
    And I should see message metadata prefixed with "Digital assistant at"
    When I send the message "User Second Message"
    Then I should see the assistant message containing "I’m sorry I didn’t understand your question"
    And I should see message metadata prefixed with "Digital assistant at"
    When I send the message "User Third Message"
    And I should see message metadata prefixed with "Digital assistant at"

  Scenario: Offline and reconnect banners with control disable and enable
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    Then chat controls should be enabled
    When I set network offline
    Then I should see the offline banner
    And chat controls should be disabled
    When I reconnect network with retry
    Then I should see the online banner
    And chat controls should be enabled

  @history
  Scenario: Send 26 sequential messages and continue after refresh
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Something Else"
    And I click the quick reply button "Travel To The UK"
    And I send 26 sequential messages with prefix "sequential message"
    Then I should see my message "sequential message 26"
    When I refresh the page
    And I send the next sequential message with prefix "sequential message"
    Then I should observe one more inbound message after refresh

  @history
  Scenario: Scroll to top fetches older history after refresh
    Given I open the VISA web messenger
    And I dismiss cookies by accepting
    When I click the quick reply button "Something Else"
    And I click the quick reply button "Travel To The UK"
    When I send 35 sequential messages with prefix "sequential message"
    And I refresh the page
    Then I should be able to fetch older history by scrolling to top
    And the top message should be "sequential message 1"
