import { SearchField, RecentKeyword, RecentKeywordProvider, IconBtn } from '@shopby/react-components';

import useSearchKeyword from '../../hooks/useSearchKeyword';
import BackButton from '../BackButton';
import { SearchIcon } from '../Icon/SearchIcon';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const SearchKeywordContent = () => {
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword('');

  const searchKeyword = (_keyword) => {
    searchProductsByKeyword(_keyword);
    location.href = `/products?keyword=${encodeURIComponent(_keyword)}`;
  };

  useLayoutChanger({
    isMain: true,
    title: '검색',
    hasSearchKeywordHeader: true,
    hasBackBtnOnHeader: false,
  });

  return (
    <>
      {/* <div className="search-keyword-modal__top"> */}
      <div className="search-keyword-container">
        <BackButton className="search-keyword-modal__back-btn" />
        <SearchField
          searchValue={keyword}
          onSearchBtnClick={() => searchKeyword(keyword)}
          onClearBtnClick={removeKeyword}
          onChange={({ target }) => updateKeyword(target.value)}
        />
      </div>
      {/* Custom search icon can be modified in _layout.css */}
      {/* </div> */}
      <RecentKeyword onKeywordClick={(_keyword) => searchKeyword(_keyword)} />
    </>
  );
};

const SearchKeyword = () => (
  <RecentKeywordProvider>
    <div>
      <SearchKeywordContent />
    </div>
  </RecentKeywordProvider>
);

export default SearchKeyword;
