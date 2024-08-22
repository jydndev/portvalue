import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { object, bool, func, array, number, string } from 'prop-types';

import { Icon, InfiniteScrollLoader, ThumbItem, ThumbList, VisibleComponent } from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import GallerySkeleton from '../GallerySkeleton';
import ProductThumbBadge from '../ProductThumbBadge';
import ProductThumbInfo from '../ProductThumbInfo';
import TotalCountAndSort from '../TotalCountAndSort';

import NoSearchProduct from './NoSearchProduct';

const calculateDiscountRate = (originalPrice, discountedPrice) => {
  if (originalPrice === discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;

const GalleryListPage = ({
  style,
  totalCount,
  products,
  sortType,
  sortBy,
  updateSortType,
  handleIntersect,
  disabled,
  className,
  isLoading = false,
}) => (
  <div className="l-panel">
    <TotalCountAndSort totalCount={totalCount} sortType={sortType} sortBy={sortBy} updateSortType={updateSortType} />

    <VisibleComponent
      shows={products.length > 0}
      TruthyComponent={
        <>
          <ThumbList style={style} displayType={THUMB_LIST_TYPE.GALLERY} className={className}>
            {products.map(
              ({
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
                frontDisplayYn,
                brandName,
              }) =>
                frontDisplayYn && (
                  <ThumbItem
                    key={productNo}
                    resize="220x220"
                    href={`/product-detail?productNo=${productNo}`}
                    src={listImageUrls[0]}
                    adult={adult}
                    alt={productName}
                    productNo={productNo}
                  >
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
                )
            )}
          </ThumbList>
          <SkeletonComponent isLoading={isLoading} />
          <InfiniteScrollLoader onIntersect={handleIntersect} disabled={disabled} />
        </>
      }
      FalsyComponent={isLoading ? <SkeletonComponent isLoading={isLoading} /> : <NoSearchProduct />}
    />
  </div>
);

export default GalleryListPage;

SkeletonComponent.propTypes = {
  isLoading: bool,
};
GalleryListPage.propTypes = {
  style: object,
  totalCount: number,
  products: array,
  sortType: string,
  sortBy: array,
  updateSortType: func,
  handleIntersect: func,
  disabled: bool,
  className: string,
  isLoading: bool,
};
