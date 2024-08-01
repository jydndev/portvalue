import { useMemo, useState } from 'react';
import { VisibleComponent, useProductDetailStateContext } from '@shopby/react-components';
import Sanitized from '../../../components/Sanitized';
import { DownIcon } from '../../../components/Icon/DownIcon';

const TITLE_MAP = {
  freight: '배송안내',
  exchange: '교환 및 반품안내',
  refund: '환불 안내',
  afterService: 'AS 안내',
};

const ShippingClaim = () => {
  const {
    productDetail: { guide },
  } = useProductDetailStateContext();

  const [openSections, setOpenSections] = useState({});

  const guideContents = useMemo(
    () =>
      Object.entries(guide)
        .map(([titleKey, content]) => ({
          titleKey,
          content,
        }))
        .filter(({ content }) => Boolean(content)),
    [guide]
  );

  const toggleSection = (titleKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [titleKey]: !prev[titleKey],
    }));
  };

  return (
    <VisibleComponent
      shows={guideContents.length > 0}
      TruthyComponent={
        <div className="product-content-shipping-claim">
          {guideContents.map(({ titleKey, content }) => (
            <div key={`shipping-claim-${titleKey}`} className="shipping-claim-section">
              <button className="product-content__title" onClick={() => toggleSection(titleKey)}>
                <span className="title-text">{TITLE_MAP[titleKey]}</span>
                <span className={`product-content__toggle-icon ${openSections[titleKey] ? 'open' : ''}`}>
                  <DownIcon size={16} />
                </span>
              </button>
              <div className={`shipping-claim-content ${openSections[titleKey] ? 'open' : ''}`}>
                <div className="shipping-claim-content-inner">
                  <Sanitized html={content} />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      FalsyComponent={
        <div className="empty-list">
          <p>등록된 배송/교환/반품/AS 정보가 없습니다.</p>
        </div>
      }
    />
  );
};

export default ShippingClaim;
