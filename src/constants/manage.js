import { TERMS_KEY_TYPE } from '@shopby/shared';

export const TERMS_MENUS = [
  {
    path: 'company',
    title: '회사소개',
    termsKey: TERMS_KEY_TYPE.MALL_INTRODUCTION,
  },
  {
    path: 'service-policy',
    title: '이용약관',
    termsKey: TERMS_KEY_TYPE.USE,
  },
  {
    path: 'privacy-policy',
    title: '개인정보처리방침',
    bold: true,
    termsKey: TERMS_KEY_TYPE.PI_PROCESS,
  },
  {
    path: 'service-guide',
    title: '이용안내',
    termsKey: TERMS_KEY_TYPE.ACCESS_GUIDE,
  },
  {
    path: 'customer-center',
    title: '고객센터',
    used: true,
  },
];
