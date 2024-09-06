import { Link } from 'react-router-dom';

import { ThumbItem } from '@shopby/react-components';
import { calculateDiscountedPrice } from '@shopby/shared';

import ProductThumbBadge from '../ProductThumbBadge';
import ProductThumbInfo from '../ProductThumbInfo';

import SmallCartButton from '../SmallCartButton/SmallCartButton';

const ProductItem = ({
  productNo,
  adult,
  listImageUrls,
  isSoldOut,
  saleStatusType,
  salePrice,
  promotionText,
  productName,
  immediateDiscountAmt,
  additionDiscountAmt,
  brandName,
}) => {
  const calculateDiscountRate = (originalPrice, discountedPrice) => {
    if (originalPrice === discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  return (
    <ThumbItem
      key={productNo}
      resize="220x220"
      href={`/product-detail?productNo=${productNo}`}
      src={listImageUrls[0]}
      adult={adult}
      alt={productName}
      productNo={productNo}
    >
      <div className="thumb-item-wrapper" style={{ position: 'relative' }}>
        <SmallCartButton />
      </div>
      <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
      <Link to={`/product-detail?productNo=${productNo}`}>
        <ProductThumbInfo
          salePrice={calculateDiscountedPrice({
            salePrice,
            immediateDiscountAmt,
            additionDiscountAmt,
          })}
          brandName={brandName}
          promotionText={promotionText}
          productName={productName}
          discountRate={calculateDiscountRate(
            salePrice,
            calculateDiscountedPrice({
              salePrice,
              immediateDiscountAmt,
              additionDiscountAmt,
            })
          )}
        />
      </Link>
    </ThumbItem>
  );
};

export default ProductItem;
