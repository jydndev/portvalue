import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ProductSearchProvider,
  ProductSectionListProvider,
  CategoriesProvider,
  VisibleComponent,
  usePageScriptsActionContext,
} from '@shopby/react-components';
import CategoryMenu from './menu/CategoryMenu';
import ProductListWrapSection from './ProductListWrapSection';
import ProductListWrapCategory from './ProductListWrapCategory';

const ProductListPage = ({ isSection = false }) => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const categoryNo = Number(searchParams.get('categoryNo'));
  const depth = Number(searchParams.get('depth') ?? 1);
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  const Provider = useMemo(() => (isSection ? ProductSectionListProvider : ProductSearchProvider), [isSection]);

  return (
    <Provider>
      <VisibleComponent
        shows={!keyword && !isSection}
        TruthyComponent={
          <CategoriesProvider>
            <CategoryMenu categoryNo={categoryNo} depth={depth} />
          </CategoriesProvider>
        }
      />
      {isSection ? <ProductListWrapSection /> : <ProductListWrapCategory />}
    </Provider>
  );
};

export default ProductListPage;
