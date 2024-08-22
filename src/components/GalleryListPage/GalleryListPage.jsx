import { object, bool, func, array, number, string } from 'prop-types';
import { InfiniteScrollLoader, VisibleComponent } from '@shopby/react-components';
import TotalCountAndSort from '../TotalCountAndSort';
import ProductList from './ProductList';
import NoSearchProduct from './NoSearchProduct';
import GallerySkeleton from '../GallerySkeleton';

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;

SkeletonComponent.propTypes = {
  isLoading: bool,
};

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

GalleryListPage.defaultProps = {
  isLoading: false,
};
