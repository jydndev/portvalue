import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from 'react-router-dom';

import {
  ProductSearchProvider,
  CategoriesProvider,
  VisibleComponent,
  usePageScriptsActionContext,
  ProductSectionListProvider,
} from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import DisplayCategoryListWrap from './DisplayCategoryListWrap';
import ProductSectionListWrap from './ProductSectionListWrap';
import CategoryMenu from './menu/CategoryMenu';

const DisplayCategoryList = () => {
  const { t } = useTranslation('title');
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);
  const { delayPageScriptLoading } = usePageScriptsActionContext();
  const location = useLocation();

  useLayoutChanger({
    hasBackBtnOnHeader: !keyword,
    hasBottomNav: true,
    hasCartBtnOnHeader: !keyword,
    title: keyword || t('상품 목록'),
    hasSearchKeywordHeader: !!keyword,
  });

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  const isProductsPath = location.pathname === '/products';
  const isDisplaySectionsPath = location.pathname.startsWith('/display/');

  return (
    <>
      {isProductsPath && (
        <ProductSearchProvider>
          <VisibleComponent
            shows={!keyword}
            TruthyComponent={
              <CategoriesProvider>
                <CategoryMenu categoryNo={categoryNo} depth={depth} />
              </CategoriesProvider>
            }
          />
          <DisplayCategoryListWrap />
        </ProductSearchProvider>
      )}
      {isDisplaySectionsPath && (
        <ProductSectionListProvider>
          <ProductSectionListWrap />
        </ProductSectionListProvider>
      )}
    </>
  );
};

export default DisplayCategoryList;
