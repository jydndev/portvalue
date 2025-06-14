import { useTranslation } from 'react-i18next';
import { number, string } from 'prop-types';
import { convertToKoreanCurrency } from '@shopby/shared';

// ===========================
// 상품 아이템 정보
// ===========================
const ProductThumbInfo = ({ brandName, promotionText, productName, salePrice, discountRate }) => {
  const { t } = useTranslation('unit');
  return (
    <>
      <p className="product-thumb-title">
        [{brandName}] {promotionText} {productName}
      </p>
      <p className="product-thumb-price-info">
        <span>
          {discountRate > 0 && (
            <em className="product-thumb-discount-rate">
              {discountRate}
              <span>%</span>
            </em>
          )}
          <em className="product-thumb-price">{convertToKoreanCurrency(salePrice)}</em>
          <span className="product-thumb-unit">{t('WON')}</span>
        </span>
      </p>
    </>
  );
};

export default ProductThumbInfo;

ProductThumbInfo.propTypes = {
  brandName: string,
  promotionText: string,
  productName: string,
  salePrice: number,
  discountRate: number,
};
