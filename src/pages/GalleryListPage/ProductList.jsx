import { ThumbList } from '@shopby/react-components';
import { THUMB_LIST_TYPE } from '@shopby/shared';
import ProductItem from './ProductItem';

const ProductList = ({ products, style, className }) => (
  <ThumbList style={style} displayType={THUMB_LIST_TYPE.GALLERY} className={className}>
    {products.map((product) => product.frontDisplayYn && <ProductItem key={product.productNo} {...product} />)}
  </ThumbList>
);

export default ProductList;
