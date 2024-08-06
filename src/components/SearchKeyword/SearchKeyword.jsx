import { SearchField, RecentKeyword, RecentKeywordProvider, IconBtn } from '@shopby/react-components';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import BackButton from '../BackButton';
import { SearchIcon } from '../Icon/SearchIcon';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import { useEffect } from 'react';
import { scrollToTop } from '../../utils';

const SearchKeywordContent = () => {
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword('');

  const searchKeyword = (_keyword) => {
    searchProductsByKeyword(_keyword);
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  return (
    <>
      <div className="search-keyword-container">
        <BackButton className="search-keyword-back-btn" />
        <SearchField
          className="search-keyword-field"
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
        {/* Custom search icon can be modified in _layout.css */}
      </div>
    </>
  );
};

const SearchKeyword = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: false,
    hasCartBtnOnHeader: false,
    hasBottomNav: true,
  });

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <RecentKeywordProvider>
      <div className="search-keyword-page">
        <header className="search-keyword-header">
          <SearchKeywordContent />
        </header>
        <main className="search-keyword-main">
          <RecentKeyword onKeywordClick={(_keyword) => searchKeyword(_keyword)} />
        </main>
      </div>
    </RecentKeywordProvider>
  );
};

export default SearchKeyword;
