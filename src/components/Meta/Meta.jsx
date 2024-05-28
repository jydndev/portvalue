/* eslint-disable complexity */
import { useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { Helmet } from 'react-helmet';
import { useLocation, useSearchParams } from 'react-router-dom';

import {
  useEventStateContext,
  useAuthStateContext,
  useBannerStateContext,
  useMallStateContext,
  useNaverShoppingConfigurationStateContext,
  usePageScriptsStateContext,
  usePageScriptsActionContext,
  useProductDetailStateContext,
  useShopbyStatisticsRecorder,
} from '@shopby/react-components';
import { PLATFORM_TYPE, initializeNaverShoppingConfiguration } from '@shopby/shared';

import { platformType } from '../../utils';

import ExternalServiceConfig from './ExternalServiceConfig';
import { removedDuplicateMetas, getPageScriptTitleTag } from './utils';

const Meta = () => {
  const [searchParams] = useSearchParams();
  const { mallName, mall, externalServiceConfig, isLoading: isMallLoading } = useMallStateContext();
  const { productDetail } = useProductDetailStateContext();
  const { bannerMap, isLoading: isBannerLoading } = useBannerStateContext();
  const platform = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;
  const mallUrl = mall.url?.[platform.toLocaleLowerCase()];

  const location = useLocation();
  const { profile, isProfileLoading } = useAuthStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { isLoading: isPageScriptsLoading, pageScripts } = usePageScriptsStateContext();
  const { clientId, mallProfile } = useMallStateContext();
  const { isScriptLoaded, record } = useShopbyStatisticsRecorder({ clientId, mallProfile });
  const { configuration } = useNaverShoppingConfigurationStateContext();

  const productNo = Number(searchParams.get('productNo'));
  const eventInfo = useEventStateContext();

  const naverWebmaster = externalServiceConfig?.naverWebmaster;
  const isProductDetailPage = window.location.href.includes('product-detail');
  const isEventPage = window.location.href.includes('/event');

  const creatableMetaTag = useMemo(() => {
    if (isProductDetailPage && !productDetail?.baseInfo?.productName) {
      return false;
    }

    if (isEventPage && !eventInfo?.eventNo) {
      return false;
    }

    if (!isMallLoading && !isPageScriptsLoading && !isBannerLoading) {
      return true;
    }

    return false;
  }, [
    isProductDetailPage,
    productDetail?.baseInfo?.productNo,
    isEventPage,
    eventInfo?.eventNo,
    isMallLoading,
    isPageScriptsLoading,
    isBannerLoading,
    location.href,
  ]);

  const { metas: renderableMetas, titleContent } = useMemo(() => {
    if (!creatableMetaTag) {
      return {};
    }

    return removedDuplicateMetas({
      productDetail,
      bannerMap,
      eventInfo,
      mallName,
      mallUrl,
      pageScripts,
      isProductDetailPage,
      isEventPage,
    });
  }, [creatableMetaTag, location.href]);

  const pageScriptTitleTag = getPageScriptTitleTag();

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
  }, [isScriptLoaded, isProfileLoading, location.pathname, productNo]);

  useEffect(() => {
    if (isProfileLoading || !renderableMetas?.length) {
      return;
    }

    applyPageScripts('COMMON', {
      getPlatform: () => platformType,
      profile,
    });
    applyPageScripts('COMMON_HEAD');

    applyPageScripts('COMMON_FOOTER');
  }, [renderableMetas, profile, isProfileLoading, location]);

  return (
    <>
      <Helmet>
        {renderableMetas?.map((info, index) => {
          const title = pageScriptTitleTag?.textContent;
          const { name, property } = info;

          if (title && (name?.includes('title') || property?.includes('title'))) {
            info.content = title;
          }

          return <meta key={`${index}-${name ? name : property}`} {...info} />;
        })}
        {!pageScriptTitleTag?.textContent && <title>{titleContent}</title>}
      </Helmet>
      <ExternalServiceConfig />
    </>
  );
};

export default Meta;
