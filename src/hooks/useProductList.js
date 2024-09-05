import { useState, useEffect, useCallback, useRef } from 'react';

const useProductList = (fetchProducts, applyScripts, scriptType, initialState) => {
  const [queryString, setQueryString] = useState({
    pageNumber: initialState.pageNumber,
    pageSize: 10,
    sortType: initialState.sortType,
    ...initialState,
    soldOut: true,
    saleStatus: 'ONSALE',
  });

  const [disabled, setDisabled] = useState(false);
  const prevQueryString = useRef(queryString);

  useEffect(() => {
    console.log('useProductList effect', { queryString, prevQueryString: prevQueryString.current });
    if (JSON.stringify(prevQueryString.current) !== JSON.stringify(queryString)) {
      console.log('Fetching products', queryString);
      fetchProducts(queryString);
      setDisabled(false);
      prevQueryString.current = queryString;
    }
  }, [queryString, fetchProducts]);

  const handleIntersect = useCallback(() => {
    setDisabled(true);
    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  }, []);

  return { queryString, setQueryString, disabled, handleIntersect };
};

export default useProductList;
