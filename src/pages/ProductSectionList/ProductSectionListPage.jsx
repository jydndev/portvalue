import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { ProductSectionListProvider, usePageScriptsActionContext } from '@shopby/react-components';

import ProductSectionListWrap from './ProductSectionListWrap';

export const ProductSectionListPage = () => {
  const platformType = useOutletContext();
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <ProductSectionListProvider platformType={platformType}>
      <ProductSectionListWrap />
    </ProductSectionListProvider>
  );
};
