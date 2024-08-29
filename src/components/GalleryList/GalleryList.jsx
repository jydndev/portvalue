import { object, bool, func, array, number, string } from 'prop-types';

import { InfiniteScrollLoader, VisibleComponent } from '@shopby/react-components';

import TotalCountAndSort from '../TotalCountAndSort';
import GallerySkeleton from '../GallerySkeleton';

import ProductList from './ProductList';
import NoSearchProduct from './NoSearchProduct';

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;

SkeletonComponent.propTypes = {
  isLoading: bool,
};

const GalleryList = ({
  style,
  totalCount,
  products,
  sortType,
  sortBy,
  updateSortType,
  handleIntersect,
  disabled,
  className,
  isLoading,
}) => (
  <div className="l-panel">
    <TotalCountAndSort totalCount={totalCount} sortType={sortType} sortBy={sortBy} updateSortType={updateSortType} />

    <VisibleComponent
      shows={products.length > 0}
      TruthyComponent={
        <>
          <ProductList products={products} style={style} className={className} />
          <SkeletonComponent isLoading={isLoading} />
          <InfiniteScrollLoader onIntersect={handleIntersect} disabled={disabled} />
        </>
      }
      FalsyComponent={isLoading ? <SkeletonComponent isLoading={isLoading} /> : <NoSearchProduct />}
    />
  </div>
);

GalleryList.propTypes = {
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

GalleryList.defaultProps = {
  isLoading: false,
};

export default GalleryList;
