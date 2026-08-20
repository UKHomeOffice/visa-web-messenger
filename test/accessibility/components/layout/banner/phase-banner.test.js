import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PhaseBanner from '../../../../../src/components/layout/banner/phase-banner';

const { axe, toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

describe('PhaseBanner component', () => {

  test('renders PhaseBanner component with no accessibility violations', async () => {
    const { container } = render(<PhaseBanner />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  test('renders the feedback link with the expected URL and target', () => {
    render(<PhaseBanner />);

    const link = screen.getByRole('link', {
      name: /give your feedback \(opens in new tab\)/i,
    });

    expect(link).toHaveAttribute('href', 'https://ukhomeoffice.qualtrics.com/jfe/form/SV_ehDrH6eJrtGBFMW');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
