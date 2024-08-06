import React from 'react';
// import { useOffCanvasActionContext } from '@shopby/react-components';

const categories = [
  {
    name: '신규',
    url: '/display/SCMO0002',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134228333Z_portvalue.png',
  },
  {
    name: '인기',
    url: '/display/SCMO0001',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134226543Z_portvalue.png',
  },
  {
    name: '플틴박스',
    url: '/product-detail?productNo=120889541',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134140949Z_portvalue.png',
  },
  {
    name: '골라담기',
    url: 'products?categoryNo=799588',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134145058Z_portvalue.png',
  },
  {
    name: '칩',
    url: '/products?categoryNo=789438',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134142590Z_portvalue.png',
  },
  {
    name: '바',
    url: '/products?categoryNo=789437',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134605397Z_portvalue.png',
  },
  {
    name: '쿠키',
    url: '/products?categoryNo=789439',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134415517Z_portvalue.png',
  },
  {
    name: '볼',
    url: '/products?categoryNo=789440',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134138636Z_portvalue.png',
  },
  {
    name: '음료',
    url: '/products?categoryNo=789441',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134456650Z_portvalue.png',
  },
  {
    name: '파우치',
    url: '/products?categoryNo=789442',
    image: 'https://healthfriend.s3.ap-northeast-2.amazonaws.com/20240619T134440493Z_portvalue.png',
  },
];

const CategoryNavigation = ({ platformType }) => {
  // const { openCanvas } = useOffCanvasActionContext();
  const firstRow = categories.slice(0, 5);
  const secondRow = categories.slice(5, 10);

  const goToCategory = (url) => {
    window.location.href = url;
  };

  const handleCategoryClick = (category) => {
    if (category.name === '전체') {
      // openCanvas();
    } else if (category.name === '인기') {
      if (platformType === 'PC') {
        goToCategory('/display/SCPC0001');
      } else if (platformType === 'MOBILE_WEB') {
        goToCategory('/display/SCMO0001');
      }
    } else if (category.name === '신규') {
      if (platformType === 'PC') {
        goToCategory('/display/SCPC0002');
      } else if (platformType === 'MOBILE_WEB') {
        goToCategory('/display/SCMO0002');
      }
    } else {
      goToCategory(category.url);
    }
  };

  return (
    <div className="main-category">
      <div className="button-container-first">
        {firstRow.map((category, index) => (
          <div key={index} className="category-container" onClick={() => handleCategoryClick(category)}>
            <img
              className="category-img"
              src={category.image}
              alt={category.name}
              style={{ width: '48px', height: '48px' }}
            />
            <div className="category-name">{category.name}</div>
          </div>
        ))}
      </div>
      <div className="button-container-second">
        {secondRow.map((category, index) => (
          <div key={index} className="category-container" onClick={() => handleCategoryClick(category)}>
            <img
              className="category-img"
              src={category.image}
              alt={category.name}
              style={{ width: '48px', height: '48px' }}
            />
            <div className="category-name">{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation;
