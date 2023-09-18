import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import {
  useAuthStateContext,
  useBannerStateContext,
  useMallStateContext,
  useNaverShoppingConfigurationStateContext,
  usePageScriptsActionContext,
  useProductDetailStateContext,
  useShopbyStatisticsRecorder,
} from '@shopby/react-components';
import { PLATFORM_TYPE, initializeNaverShoppingConfiguration } from '@shopby/shared';

import { META_TAG_KEY } from '../../constants/common';
import { platformType } from '../../utils';

import ExternalServiceConfig from './ExternalServiceConfig';

const scheme = `${location.origin.split('://').at(0)}`;
const addScheme = (url) => (url ? `${scheme}:${url}` : '');

const metaTagCreatorMap = {
  [META_TAG_KEY.PRODUCT]: ({ productNo, productName, imageUrls, url }) => ({
    type: 'product',
    title: productName,
    image: addScheme(imageUrls?.at(0)),
    url: `${url}/product-detail?productNo=${productNo}`,
  }),
  [META_TAG_KEY.COMMON]: ({ mallName, bannerMap, url }) => {
    const banner = bannerMap.get('LOGO') ?? {};

    return {
      type: 'website',
      title: mallName,
      image: addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url,
    };
  },
};

const createMetaTagBy = ({ product, mallName, url, bannerMap } = {}) => {
  const isProductDetailPage = window.location.href.includes('product-detail') || product?.productName;
  const metaTagKey = isProductDetailPage ? META_TAG_KEY.PRODUCT : META_TAG_KEY.COMMON;

  return metaTagCreatorMap[metaTagKey]({
    ...product,
    mallName,
    bannerMap,
    url,
  });
};

const Meta = () => {
  const { mallName, mall, externalServiceConfig } = useMallStateContext();
  const { productDetail } = useProductDetailStateContext();
  const { bannerMap } = useBannerStateContext();
  const platform = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;
  const mallUrl = mall.url?.[platform.toLocaleLowerCase()];

  const location = useLocation();
  const { profile, isProfileLoading } = useAuthStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { clientId, mallProfile } = useMallStateContext();
  const { isScriptLoaded, record } = useShopbyStatisticsRecorder({ clientId, mallProfile });
  const { configuration } = useNaverShoppingConfigurationStateContext();

  const { type, title, image, url } = createMetaTagBy({
    product: productDetail?.baseInfo,
    bannerMap,
    mallName,
    url: mallUrl,
  });

  const naverWebmaster = externalServiceConfig?.naverWebmaster;

  useEffect(() => {
    initializeNaverShoppingConfiguration({
      naverWebmaster,
      configuration,
    });
  }, [naverWebmaster, configuration]);

  useEffect(() => {
    if (isScriptLoaded && !isProfileLoading) {
      record(profile?.memberNo);
    }
  }, [isScriptLoaded, isProfileLoading, location.pathname]);

  useEffect(() => {
    if (!image) return;
    if (isProfileLoading) return;

    applyPageScripts('COMMON', {
      getPlatform: () => platformType,
      profile,
    });
    applyPageScripts('COMMON_HEAD');
    applyPageScripts('COMMON_FOOTER');
  }, [image, profile, isProfileLoading, location]);

  if (!image) return <></>;

  return (
    <>
      <Helmet>
        <meta name="author" content={mallName} />
        <meta name="description" content={mallName} />
        <meta name="keywords" content={mallName} />

        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content="여기를 눌러 링크를 확인하세요." />
        <meta property="og:image:width" content="436" />
        <meta property="og:image:height" content="134" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content="여기를 눌러 링크를 확인하세요." />
        <meta name="twitter:image" content={image} />
        <title>{mallName}</title>
      </Helmet>
      <ExternalServiceConfig />
    </>
  );
};

export default Meta;
