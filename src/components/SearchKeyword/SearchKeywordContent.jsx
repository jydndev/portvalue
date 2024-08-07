import useSearchKeyword from '../../hooks/useSearchKeyword';
import BackButton from '../BackButton';
import { SearchField } from '@shopby/react-components';

const SearchKeywordContent = ({ onSearch }) => {
  const { keyword, searchProductsByKeyword, removeKeyword, updateKeyword } = useSearchKeyword('');

  const handleSearch = (_keyword) => {
    searchProductsByKeyword(_keyword);
    onSearch(_keyword);
  };

  // TODO: 1. focus on load 2. set placeholder value
  return (
    <div className="search-keyword-container">
      <BackButton className="search-keyword-back-btn" />
      <SearchField
        className="search-keyword-field"
        searchValue={keyword}
        onSearchBtnClick={() => handleSearch(keyword)}
        onClearBtnClick={removeKeyword}
        onChange={({ target }) => updateKeyword(target.value)}
        placeholder=""
      />
      {/* Custom search icon can be modified in _layout.css */}
    </div>
  );
};

export default SearchKeywordContent;
