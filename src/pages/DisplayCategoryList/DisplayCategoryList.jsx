import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  ProductSearchProvider,
  CategoriesProvider,
  VisibleComponent,
  usePageScriptsActionContext,
  CartProvider,
  ProductOptionProvider,
  OrderSheetProvider,
  TabsProvider,
} from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import DisplayCategoryListWrap from './DisplayCategoryListWrap';
import CategoryMenu from './menu/CategoryMenu';

const DisplayCategoryList = () => {
  const { t } = useTranslation('title');

  const initialTabs = [
    { value: 'DETAIL', label: t('상세정보') },
    // Add more tabs as needed
  ];

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);
  const { delayPageScriptLoading } = usePageScriptsActionContext();
  const productNo = Number(searchParams.get('productNo'));

  if (keyword) {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: keyword,
      hasSearchKeywordHeader: true,
    });
  } else {
    useLayoutChanger({
      hasBackBtnOnHeader: true,
      hasBottomNav: true,
      hasCartBtnOnHeader: true,
      title: t('상품 목록'),
    });
  }

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <TabsProvider
      initialState={{
        currentTab: 'DETAIL',
        tabs: initialTabs,
      }}
    >
      <OrderSheetProvider>
        <CartProvider>
          <ProductOptionProvider productNo={productNo}>
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
          </ProductOptionProvider>
        </CartProvider>
      </OrderSheetProvider>
    </TabsProvider>
  );
};

export default DisplayCategoryList;
