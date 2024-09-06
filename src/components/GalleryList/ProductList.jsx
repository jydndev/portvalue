import {
  CartProvider,
  NaverPayProvider,
  OrderSheetProvider,
  ProductOptionProvider,
  ThumbList,
} from '@shopby/react-components';
import { useMallStateContext } from '@shopby/react-components';
import { isMobile } from 'react-device-detect';

import { THUMB_LIST_TYPE } from '@shopby/shared';
import ProductItem from './ProductItem';

const ProductList = ({ products, style, className }) => {
  const { clientId, mallProfile } = useMallStateContext();

  return (
    <ThumbList style={style} displayType={THUMB_LIST_TYPE.GALLERY} className={className}>
      {products.map(
        (product) =>
          product.frontDisplayYn && (
            <OrderSheetProvider key={product.productNo}>
              <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
                <CartProvider>
                  <ProductOptionProvider productNo={product.productNo}>
                    <ProductItem key={product.productNo} {...product} />
                  </ProductOptionProvider>
                </CartProvider>
              </NaverPayProvider>
            </OrderSheetProvider>
          )
      )}
    </ThumbList>
  );
};

export default ProductList;
