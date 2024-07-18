import { isMobile } from 'react-device-detect';

import { META_TAG_KEY } from '../../constants/common';

const META_PATTERN = /<meta\s+[^>]*\/?>/g;
const TITLE_PATTERN = /<title[^>]*>[^<]*<\/title>/g;

let pageScriptTitleTag = null;

const scheme = `${location.origin.split('://').at(0)}`;
const addScheme = (url) => (url ? `${scheme}:${url}` : '');

const metaTagCreatorMap = {
  [META_TAG_KEY.PRODUCT]: ({ productName, imageUrls }) => ({
    type: 'product',
    title: productName,
    image: addScheme(imageUrls?.at(0)),
    url: location.href,
  }),
  [META_TAG_KEY.COMMON]: ({ mallName, bannerMap }) => {
    const banner = bannerMap.get('LOGO') ?? {};
    return {
      type: 'website',
      title: mallName,
      image: addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url: location.origin,
    };
  },
  [META_TAG_KEY.EVENT]: ({ eventInfo, mallName, bannerMap }) => {
    const title = eventInfo?.label ? eventInfo.label : mallName;
    const imageUrl = isMobile ? eventInfo?.mobileImageUrl : eventInfo?.pcImageUrl;
    const banner = bannerMap.get('LOGO') ?? {};

    return {
      type: 'product',
      title,
      image: imageUrl ? addScheme(imageUrl) : addScheme(banner?.banners?.[0].bannerImages?.[0].imageUrl),
      url: location.href,
    };
  },
};

const getMetaTagKey = ({ isProductDetailPage, isEventPage }) => {
  if (isProductDetailPage) {
    return META_TAG_KEY.PRODUCT;
  }

  if (isEventPage) {
    return META_TAG_KEY.EVENT;
  }

  return META_TAG_KEY.COMMON;
};

const createMetaTagBy = ({ product, mallName, url, bannerMap, eventInfo, isProductDetailPage, isEventPage } = {}) => {
  const metaTagKey = getMetaTagKey({
    isProductDetailPage,
    isEventPage,
  });

  return metaTagCreatorMap[metaTagKey]({
    ...product,
    mallName,
    bannerMap,
    url,
    eventInfo,
  });
};

const getMetaMap = ({ mallName, title, image, type, url }) => ({
  author: {
    attr: 'name',
    content: '단성비',
  },
  description: {
    attr: 'name',
    content: '단백질칩, 바, 쿠키 등 다양한 단백질 간식들을 확인하고 나에게 맞는 상품을 구매해보세요',
  },
  keywords: {
    attr: 'name',
    content:
      '단백질칩, 단백질바, 단백질쿠키, 단백질볼, 단백질음료, 단백질파우치, 단성비, 단성비마켓, 근육, 건강한 식단',
  },
  'twitter:card': {
    attr: 'name',
    content: 'summary',
  },
  'twitter:title': {
    attr: 'name',
    content: '단성비마켓 | 단백질 간식 전문 스토어',
  },
  'twitter:description': {
    attr: 'name',
    content: '단백질칩, 바, 쿠키 등 다양한 단백질 간식들을 확인하고 나에게 맞는 상품을 구매해보세요',
  },
  'twitter:image': {
    attr: 'name',
    content: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240718T024323175Z_portvalue.png',
  },
  'og:site_name': {
    attr: 'property',
    content: '단성비마켓 | 단백질 간식 전문 스토어',
  },
  'og:type': {
    attr: 'property',
    content: type,
  },
  'og:title': {
    attr: 'property',
    content: '단성비마켓 | 단백질 간식 전문 스토어',
  },
  'og:image': {
    attr: 'property',
    content: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240718T024323175Z_portvalue.png',
  },
  'og:url': {
    attr: 'property',
    content: url,
  },
  'og:description': {
    attr: 'property',
    content: '단백질칩, 바, 쿠키 등 다양한 단백질 간식들을 확인하고 나에게 맞는 상품을 구매해보세요',
  },
  'og:image:width': {
    attr: 'property',
    content: '800',
  },
  'og:image:height': {
    attr: 'property',
    content: '400',
  },
});

const convertStrToTag = (str) => {
  const range = document.createRange();
  return range.createContextualFragment(str).children[0];
};

const getMetaTags = (pageScripts) =>
  pageScripts.reduce((acc, { pageType, content }) => {
    if (pageType !== 'COMMON_HEAD') {
      return acc;
    }

    const parsed = content.match(META_PATTERN)?.map(convertStrToTag) ?? [];
    pageScriptTitleTag = content.match(TITLE_PATTERN)?.map(convertStrToTag)?.at(0);

    return [...acc, ...parsed];
  }, []);

const getMetaAttributes = (metatags) =>
  metatags.flatMap((tag) => {
    const name = tag.getAttribute('name');
    const property = tag.getAttribute('property');

    return [name, property].filter(Boolean);
  });

const getAdminMetaAttributes = (pageScripts) => {
  if (!pageScripts?.length) {
    return [];
  }

  return getMetaAttributes(getMetaTags(pageScripts));
};

export const removedDuplicateMetas = ({
  productDetail,
  bannerMap,
  mallName,
  mallUrl,
  pageScripts,
  eventInfo,
  isProductDetailPage,
  isEventPage,
}) => {
  const customMetaInfo = createMetaTagBy({
    product: productDetail?.baseInfo,
    bannerMap,
    mallName,
    url: mallUrl,
    isProductDetailPage,
    isEventPage,
    eventInfo,
  });

  const metaInfo = getMetaMap({
    ...customMetaInfo,
    mallName,
    eventInfo,
  });

  const adminMetaAttributes = getAdminMetaAttributes(pageScripts);

  return {
    metas: Object.entries(metaInfo).reduce((acc, [value, { attr, ...info }]) => {
      if (!adminMetaAttributes.includes(value)) {
        acc.push({
          ...info,
          [attr]: value,
        });
      }

      return acc;
    }, []),
    titleContent: customMetaInfo.title,
  };
};

export const getPageScriptTitleTag = () => pageScriptTitleTag;
