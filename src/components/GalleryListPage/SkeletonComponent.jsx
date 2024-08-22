import { bool } from 'prop-types';
import GallerySkeleton from '../GallerySkeleton';

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;

SkeletonComponent.propTypes = {
  isLoading: bool,
};

export default SkeletonComponent;
