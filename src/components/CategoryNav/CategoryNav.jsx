import useLayoutChanger from '../../hooks/useLayoutChanger';
import CategoryNavLinks from './CategoryNavLinks';

const CategoryNav = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    title: '카테고리',
  });

  return (
    <div className="category-nav-page">
      <CategoryNavLinks />
    </div>
  );
};

export default CategoryNav;
