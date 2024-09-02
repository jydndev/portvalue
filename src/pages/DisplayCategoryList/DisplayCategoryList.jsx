import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  ProductSearchProvider,
  CategoriesProvider,
  VisibleComponent,
  usePageScriptsActionContext,
} from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import DisplayCategoryListWrap from './DisplayCategoryListWrap';
import CategoryMenu from './menu/CategoryMenu';

const DisplayCategoryList = () => {
  const { t } = useTranslation('title');
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);
  const { delayPageScriptLoading } = usePageScriptsActionContext();

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

  return (
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
  );
};

export default DisplayCategoryList;
