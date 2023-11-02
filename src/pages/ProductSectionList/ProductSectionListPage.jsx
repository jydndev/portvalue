import { useEffect } from 'react';

import { ProductSectionListProvider, usePageScriptsActionContext } from '@shopby/react-components';

import ProductSectionListWrap from './ProductSectionListWrap';

export const ProductSectionListPage = () => {
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <ProductSectionListProvider>
      <ProductSectionListWrap />
    </ProductSectionListProvider>
  );
};
