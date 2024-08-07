import SearchKeywordContent from './SearchKeywordContent';

import { RecentKeyword, RecentKeywordProvider } from '@shopby/react-components';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import { useEffect } from 'react';
import { scrollToTop } from '../../utils';

const SearchKeyword = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: false,
    hasCartBtnOnHeader: false,
    hasBottomNav: true,
  });

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleSearch = (_keyword) => {
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  return (
    <RecentKeywordProvider>
      <div className="search-keyword-page">
        <header className="search-keyword-header">
          <SearchKeywordContent onSearch={handleSearch} />
        </header>
        <main className="search-keyword-main">
          <RecentKeyword onKeywordClick={handleSearch} />
        </main>
      </div>
    </RecentKeywordProvider>
  );
};

export default SearchKeyword;
