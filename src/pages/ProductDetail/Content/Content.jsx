import { useMemo, lazy, Suspense, useRef, useEffect } from 'react';

import { Tabs, useTabsStateContext } from '@shopby/react-components';

const LAZY_COMPONENT_MAP = {
  DETAIL: lazy(() => import('./Detail')),
  REVIEW: lazy(() => import('../Review')),
  INQUIRY: lazy(() => import('../Inquiry')),
  SHIPPING_CLAIM: lazy(() => import('./ShippingClaim')),
};

const ActiveComponent = () => {
  const { currentTab } = useTabsStateContext();

  const Component = useMemo(() => LAZY_COMPONENT_MAP[currentTab], [currentTab]);

  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (box) {
      const boxTop = box.getBoundingClientRect().top + window.scrollY;
      const newScrollPosition = boxTop - 100;
      window.scrollTo({
        top: newScrollPosition,
        behavior: 'smooth',
      });
    }
  }, [currentTab]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  return (
    <div className="product-content__box" ref={boxRef}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </div>
  );
};

const Content = () => (
  <section className="l-panel product-content">
    <Tabs />
    <ActiveComponent />
  </section>
);

export default Content;
