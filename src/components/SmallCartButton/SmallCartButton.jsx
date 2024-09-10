import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useProductDetailActionContext,
  useProductOptionActionContext,
  useProductDetailStateContext,
} from '@shopby/react-components';

import Purchase from '../../pages/ProductDetail/Purchase';

const SmallCartButton = ({ productNo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const channelType = searchParams.get('channelType');

  const { fetchProductDetail, fetchRelatedProducts } = useProductDetailActionContext();
  const { fetchSelectorOptions } = useProductOptionActionContext();
  const { productDetail } = useProductDetailStateContext();

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!productNo) {
        console.error('Product number is undefined');
        return;
      }

      try {
        fetchProductDetail({ productNo, channelType });
        fetchRelatedProducts({ productNo });
        fetchSelectorOptions({ productNo });
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    [productNo, channelType, fetchProductDetail, fetchRelatedProducts, fetchSelectorOptions]
  );

  if (!productNo) {
    console.warn('Product number is undefined for SmallCartButton');
    return null;
  }

  return (
    <>
      <div
        className="small-shopping-cart"
        style={{
          position: 'absolute',
          bottom: '18px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          padding: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={{ width: '20px', height: '20px' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      {isOpen && productDetail && <Purchase customProductNo={productNo} />}
    </>
  );
};

export default SmallCartButton;
