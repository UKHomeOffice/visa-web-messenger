export default function PhaseBanner() {
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">
          Beta
        </strong>
        <span className="govuk-phase-banner__text">
          This is a new service. Help us improve it and <a href="https://ukhomeoffice.qualtrics.com/jfe/form/SV_ehDrH6eJrtGBFMW" className="govuk-link govuk-link--no-visited-state" target="_blank" >give your feedback (opens in new tab)</a>.
        </span>
      </p>
    </div>
  );
}
