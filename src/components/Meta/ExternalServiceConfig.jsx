import { Helmet } from 'react-helmet';

import { useMallStateContext } from '@shopby/react-components';

const getNaverWebmasterTag = (externalServiceConfig) => {
  const naverWebmaster = externalServiceConfig?.naverWebmaster;
  if (!naverWebmaster) return <></>;

  return (
    <Helmet>
      <meta name="naver-site-verification" content={naverWebmaster} />
    </Helmet>
  );
};

const getGoogleAnalyticsScriptTag = (externalServiceConfig) => {
  const id = externalServiceConfig?.googleAnalytics;

  if (!id) return <></>;

  const SCRIPT_URL = `//www.googletagmanager.com/gtag/js?id=${id}`;

  return (
    <Helmet>
      <script type="text/javascript" async={true} src={SCRIPT_URL}></script>
      <script type="text/javascript">
        {`window.dataLayer = window.dataLayer || [];
            function gtag(...args) {
              window.dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', "${id}");`}
      </script>
    </Helmet>
  );
};

const ExternalServiceConfig = () => {
  const { externalServiceConfig } = useMallStateContext();

  return (
    <>
      {getNaverWebmasterTag(externalServiceConfig)}
      {getGoogleAnalyticsScriptTag(externalServiceConfig)}
    </>
  );
};

export default ExternalServiceConfig;
