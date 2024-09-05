import { useState, useEffect } from 'react';

const useProductList = (fetchProducts, applyScripts, scriptType, initialState) => {
  const [disabled, setDisabled] = useState(false);
  const [queryString, setQueryString] = useState({
    pageNumber: initialState.pageNumber,
    pageSize: 10,
    sortType: initialState.sortType,
    ...initialState,
    soldOut: true,
    saleStatus: 'ONSALE',
  });

  const handleIntersect = () => {
    setDisabled(true);
    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setQueryString((prev) => ({
      ...prev,
      sortType: initialState.sortType,
      pageNumber: 1,
    }));
  }, [initialState.sortType]);

  useEffect(() => {
    fetchProducts(queryString);
    setDisabled(false);
  }, [queryString, fetchProducts]);

  return { queryString, setQueryString, disabled, handleIntersect };
};

export default useProductList;
