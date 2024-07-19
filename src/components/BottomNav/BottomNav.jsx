import { Link } from 'react-router-dom';

import { string, func } from 'prop-types';

import { HomeIcon } from '../Icon/HomeIcon';
import { SearchIcon } from '../Icon/SearchIcon';
import { MypageIcon } from '../Icon/MypageIcon';
import { HamburgerIconBottom } from '../Icon/HamburgerIconBottom';
import { useOffCanvasActionContext } from '@shopby/react-components';

const BottomNav = ({ className = '', search }) => {
  return (
    <>
      <nav className={`bottom-nav ${className}`}>
        <Link to="/" className="bottom-nav__link-btn">
          <HomeIcon size={28} />
          <span className="bottom-nav__label">홈</span>
        </Link>
        <Link to="category" className="bottom-nav__link-btn">
          <HamburgerIconBottom size={28} />
          <span className="bottom-nav__label">카테고리</span>
        </Link>
        <button className="bottom-nav__link-btn" onClick={search}>
          <SearchIcon size={28} />
          <span className="bottom-nav__label">검색</span>
        </button>
        <Link to="my-page" className="bottom-nav__link-btn">
          <MypageIcon size={28} />
          <span className="bottom-nav__label">마이페이지</span>
        </Link>
      </nav>
    </>
  );
};

BottomNav.propTypes = {
  className: string,
  search: func,
};

export default BottomNav;
