import { Link } from 'react-router-dom';

import { useMallStateContext } from '@shopby/react-components';
import { RightIcon } from '../../components/Icon/RightIcon';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const CategoryNavLinks = () => {
  const {
    categories: { multiLevelCategories },
  } = useMallStateContext();

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    title: '카테고리',
  });

  return (
    <div className="category-nav-content">
      {multiLevelCategories.length > 0 ? (
        <nav className="l-panel category-nav-links">
          <h2 className="a11y">상품 카테고리</h2>
          {multiLevelCategories.map((category) => (
            <Link
              key={category.categoryNo}
              to={`/products?categoryNo=${category.categoryNo}`}
              style={{ backgroundImage: `${category.icon}` }}
              className="category-nav-links__item"
            >
              {category.label}
              <span className="category-nav-links__arrow">
                <RightIcon size={16} />
              </span>
            </Link>
          ))}
        </nav>
      ) : (
        <p className="no-data">노출 중인 전시 카테고리가 없습니다.</p>
      )}
    </div>
  );
};
export default CategoryNavLinks;
