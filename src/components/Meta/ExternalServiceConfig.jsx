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

  return (
    <>
      <Helmet>
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);console.log('google test');
})(window,document,'script','dataLayer','${id}')`}</script>
      </Helmet>
      <Helmet>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        ></iframe>
      </Helmet>
    </>
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
