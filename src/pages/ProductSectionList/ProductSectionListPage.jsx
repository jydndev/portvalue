import { useEffect } from 'react';

import { ProductSectionListProvider, usePageScriptsActionContext } from '@shopby/react-components';

import ProductSectionListWrap from './ProductSectionListWrap';
import useLayoutChanger from '../../hooks/useLayoutChanger';

export const ProductSectionListPage = () => {
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useLayoutChanger({
    hasBackBtnOnHeader: true,
  });

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <ProductSectionListProvider>
      <ProductSectionListWrap />
    </ProductSectionListProvider>
  );
};
