import '@testing-library/jest-dom';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Visa from '../../src/routes/index';

jest.mock('hof-genesys-chat-component', () => ({
  GenesysChatComponent: jest.fn(() => <div data-testid="genesys-chat-component" />),
}));

const { GenesysChatComponent } = require('hof-genesys-chat-component');

const renderComponentWithRouter = (component) => render(
  <MemoryRouter>
    {component}
  </MemoryRouter>
);

beforeEach(() => {
  GenesysChatComponent.mockClear();
});

describe('Visa page', () => {
  test('renders Visa page with correct content', () => {
    renderComponentWithRouter(<Visa />);

    expect(screen.getByRole('heading', { name: 'Home Office UK Visas and Immigration Chat' })).toBeInTheDocument();
    expect(screen.getByText(/Ask our digital assistant about Visas/i)).toBeInTheDocument();
    expect(screen.getByTestId('genesys-chat-component')).toBeInTheDocument();
  });

  test('passes quick reply message sending disabling flag to Genesys chat component', () => {
    renderComponentWithRouter(<Visa />);

    const props = GenesysChatComponent.mock.calls[0][0];

    expect(props.serviceMetadata.disableTextMessageSendingOnQuickReply).toBe(true);
  });

  test('renders error component when error occurs', async () => {
    // Mock GenesysChatComponent to call errorCallback after mount
    GenesysChatComponent.mockImplementation((props) => {
      useEffect(() => {
        props.errorCallback?.();
      }, [props.errorCallback]);

      return <div data-testid="genesys-chat-component" />;
    });

    renderComponentWithRouter(<Visa />);

    await waitFor(() => {
      expect(screen.getByTestId('error-contact-form')).toBeInTheDocument();
    });

    // Ensure chat component is not rendered
    expect(screen.queryByTestId('genesys-chat-component')).not.toBeInTheDocument();
  });
});
