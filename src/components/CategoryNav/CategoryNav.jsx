import CategoryNavLinks from './CategoryNavLinks';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const CategoryNav = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '카테고리',
  });

  return (
    <>
      <CategoryNavLinks />
    </>
  );
};

export default CategoryNav;
