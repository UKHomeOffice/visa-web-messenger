import { getEnvValueByKey } from './src/env-bootstrap';

export default {
  bannerTypeDisplay: {
    bot: 'You are speaking with a digital assistant',
    human: 'You are now talking to a live agent',
    agentDisconnected:
      'The agent has disconnected. You can continue to chat with the digital assistant or start a new chat ' +
      'by sending a message to the digital assistant.',
    offline: 'You are currently offline. Messages cannot be sent until reconnected to the internet.',
    online: 'You are now online. Messages can now be sent.'
  },
  botMetaDisplay: 'Digital assistant',
  userMetaDisplay: 'You',
  maxCharacterLimit: 4096,
  service: {
    deploymentId: getEnvValueByKey('VISA_DEPLOYMENT_ID'),
    environment: getEnvValueByKey('GENESYS_ENVIRONMENT'),
    name: 'UK Visas and Immigration',
    subText: 'Visas',
    cookiePolicy: 'visa_cookie_policy',
    errorContactLink: 'https://www.gov.uk/contact-ukvi-inside-outside-uk',
    gaUtmParam: '?utm_source=webmessenger&utm_medium=internal_link&utm_campaign=UK_VISA_Internal_WebMessenger'
  },
  accessibility: {
    statementDate: '(10 November 2025)',
    statementReviewedDate: '(10 November 2025)',
    websiteUpdates: '(30 October 2025)'
  }, 
  logApiEndpoint: getEnvValueByKey('LOG_ENDPOINT')
};
