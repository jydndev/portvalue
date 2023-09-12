export default {
  '/product-detail': (code) => {
    const noReloadCodes = ['CEPR009', 'CEPR008'];
    return !noReloadCodes.includes(code);
  },
  '/cart': () => true,
};
