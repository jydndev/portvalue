import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

import { func, string, bool } from 'prop-types';

import {
  RecentKeywordProvider,
  SearchField,
  useBannerStateContext,
  useModalActionContext,
  useOffCanvasActionContext,
  IconBtn,
  CartBtn,
  useAuthStateContext,
} from '@shopby/react-components';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import { getPageTypeInformation, scrollToTop } from '../../utils';
import BackButton from '../BackButton';
import { useLayoutValueContext } from '../LayoutProvider';
import { HamburgerIconTop } from '../Icon/HamburgerIconTop';
import { CartIcon } from '../Icon/CartIcon';

import MallLogo from './MallLogo';

const SearchKeywordHeader = ({ title }) => {
  const { openAlert } = useModalActionContext();
  const [showsSearchKeyword, setShowsSearchKeyword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword(title);
  const keywordParam = searchParams.get('keyword');

  const searchKeyword = (_keyword) => {
    if (!_keyword) {
      openAlert({
        message: '키워드를 입력하세요.',
      });

      return;
    }

    searchProductsByKeyword(_keyword);
    setSearchParams({
      keyword,
    });
  };

  useEffect(() => {
    if (!keywordParam) return;

    searchProductsByKeyword(keywordParam);
    updateKeyword(keywordParam);
  }, [keywordParam]);

  return (
    <>
      {showsSearchKeyword ? (
        <SearchField
          className="header__search-field"
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
      ) : (
        <button className="header__title" onClick={() => setShowsSearchKeyword((prev) => !prev)}>
          {keyword}
        </button>
      )}
    </>
  );
};
SearchKeywordHeader.propTypes = {
  title: string,
};
const Content = ({ isMain, hasSearchKeywordHeader, title }) => {
  const { bannerMap } = useBannerStateContext();
  const { pageType } = getPageTypeInformation() ?? {};

  if (isMain) {
    return <MallLogo banner={bannerMap.get('LOGO')} />;
  }

  if (hasSearchKeywordHeader) {
    return (
      <RecentKeywordProvider>
        <SearchKeywordHeader title={title} />
      </RecentKeywordProvider>
    );
  }

  return <h1 className={`header__title ${pageType ?? ''}`}>{title}</h1>;
};

Content.propTypes = {
  isMain: bool,
  hasSearchKeywordHeader: bool,
  title: string,
};

const Header = () => {
  const {
    isMain = false,
    hasBackBtnOnHeader = false,
    hasCartBtnOnHeader = false,
    hasSearchKeywordHeader = false,
    hasCancelBtnOnHeader = false,
    title = '',
  } = useLayoutValueContext();
  const { profile } = useAuthStateContext();
  const { openCanvas } = useOffCanvasActionContext();
  const navigate = useNavigate();

  const canShowShoppingBasket = useMemo(
    () => (isMain || hasCartBtnOnHeader) && !hasCancelBtnOnHeader,
    [isMain, hasCartBtnOnHeader]
  );

  return (
    <>
      <header className={`header ${!isMain ? 'header--sub' : ''}`}>
        {hasBackBtnOnHeader && <BackButton label="페이지 뒤로 가기" className="header__left-btn" />}
        <div className="header__title">
          <Content isMain={isMain} hasSearchKeywordHeader={hasSearchKeywordHeader} title={title} />
        </div>
        {canShowShoppingBasket && (
          <div className="header__cart-btn">
            <Link to="/cart">
              <CartIcon className="cart__icon" size={32} />
              <CartBtn memberStatus={profile?.memberStatus} />
            </Link>
          </div>
        )}
        {hasCancelBtnOnHeader && (
          <IconBtn className="header__cancel-btn" icontype="x-black" onClick={() => navigate('/')} size="xs" />
        )}
      </header>
    </>
  );
};

export default Header;
