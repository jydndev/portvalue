import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@shopby/react-components';

const NoSearchProduct = () => {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword'), [searchParams]);

  return (
    <>
      {keyword ? (
        <div className="no-search">
          <h3 className="no-search__title">&apos;{keyword}&apos; 에 대한 검색결과가 없습니다.</h3>
          <Icon name="no-items" />
          <p className="no-search__description">
            정확한 검색어를 확인하시고 다시 검색해주세요.
            <br />
            일시적으로 상품이 품절 되었을 수 있습니다.
            <br />
            단어의 철자나 띄어쓰기를 다르게 해보세요.
          </p>
        </div>
      ) : (
        <p className="not-found-product">준비 중인 카테고리입니다.</p>
      )}
    </>
  );
};

export default NoSearchProduct;
