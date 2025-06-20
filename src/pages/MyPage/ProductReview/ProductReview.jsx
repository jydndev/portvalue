import { Suspense, lazy, useMemo, useEffect } from 'react';

import {
  ProfileProductReviewProvider,
  TabsProvider,
  ProductReviewProvider,
  ProductReviewFormProvider,
  useTabsStateContext,
  useProductReviewActionContext,
  Tabs,
} from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';

const DEFAULT_TABS = [
  {
    value: 'REVIEWABLE',
    label: '리뷰 작성',
  },
  {
    value: 'REVIEWED',
    label: '작성한 리뷰',
  },
];

const LAZY_COMPONENT_MAP = {
  REVIEWABLE: lazy(() => import('./ReviewableProduct')),
  REVIEWED: lazy(() => import('./ReviewedProduct')),
};

const ProductReviewContent = () => {
  const { currentTab } = useTabsStateContext();
  const { fetchConfiguration } = useProductReviewActionContext();

  const Component = useMemo(() => LAZY_COMPONENT_MAP[currentTab], [currentTab]);

  useEffect(() => {
    fetchConfiguration();
  }, []);

  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
};

const ProductReview = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '상품 리뷰 관리',
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ProfileProductReviewProvider>
      <ProductReviewProvider>
        <ProductReviewFormProvider>
          <TabsProvider
            initialState={{
              currentTab: 'REVIEWABLE',
              tabs: DEFAULT_TABS,
            }}
          >
            <div className="profile-product-review">
              <Tabs className="profile-product-review__tabs" />
              <ProductReviewContent />
            </div>
          </TabsProvider>
        </ProductReviewFormProvider>
      </ProductReviewProvider>
    </ProfileProductReviewProvider>
  );
};

export default ProductReview;
