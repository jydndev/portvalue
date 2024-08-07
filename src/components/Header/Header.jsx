import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

import { func, string, bool } from 'prop-types';

import {
  RecentKeywordProvider,
  SearchField,
  useBannerStateContext,
  useModalActionContext,
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
import useLayoutChanger from '../../hooks/useLayoutChanger';

///////// search keyword header imports //////////
import SearchKeywordContent from '../SearchKeyword/SearchKeywordContent';
/////////////////////////////////////////////////

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

  const handleSearch = (_keyword) => {
    searchProductsByKeyword(_keyword);
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  useEffect(() => {
    if (!keywordParam) return;

    searchProductsByKeyword(keywordParam);
    updateKeyword(keywordParam);
  }, [keywordParam]);

  return (
    <>
      <header className="search-keyword-header">
        <div className="search-keyword-container">
          <BackButton className="search-keyword-back-btn" />
          <SearchField
            className="search-keyword-field"
            searchValue={keyword}
            onSearchBtnClick={() => handleSearch(keyword)}
            onClearBtnClick={removeKeyword}
            onChange={({ target }) => updateKeyword(target.value)}
            placeholder={keyword}
          />
        </div>
      </header>
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
    const handleSearch = (_keyword) => {
      location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
    };

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
