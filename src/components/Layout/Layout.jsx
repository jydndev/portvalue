import { useEffect, useState, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useSearchParams } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  BannerProvider,
  Icon,
  OffCanvasProvider,
  SearchAddressProvider,
  useBoardConfigurationContextAction,
  ProductDetailProvider,
  useNaverShoppingConfigurationActionContext,
} from '@shopby/react-components';
import { PLATFORM_TYPE } from '@shopby/shared';

import { scrollToTop } from '../../utils';
import AdminBanner from '../AdminBanner';
import BottomNav from '../BottomNav';
import CategoryNav from '../CategoryNav';
import DesignPopup from '../DesignPopup';
import Footer from '../Footer';
import Header from '../Header';
import LayoutProvider, { useLayoutValueContext } from '../LayoutProvider';
import Meta from '../Meta';
import SearchKeyword from '../SearchKeyword';

const platformType = isMobile ? PLATFORM_TYPE.MOBILE_WEB : PLATFORM_TYPE.PC;

const Layout = () => {
  const [searchParams] = useSearchParams();
  const { fetchBoardConfiguration } = useBoardConfigurationContextAction();
  const { fetchConfiguration } = useNaverShoppingConfigurationActionContext();

  const pageRef = useRef();
  const pageInnerRef = useRef();

  const productNo = Number(searchParams.get('productNo'));

  useEffect(() => {
    scrollToTop();
    fetchConfiguration();
    fetchBoardConfiguration();

    /////////////////////////////////////////////////
    // const requestInit = {
    //   method,
    //   headers: {
    //     platform: 'MOBILE_WEB',
    //     clientId: 'gljUlIkewnw/bs6v/L8gFA==',
    //     Version: '1.0',
    //   },
    //   body: isFormData ? requestBody : JSON.stringify(requestBody),
    // };
    // const dynamicPart = encodeURIComponent('gljUlIkewnw/bs6v/L8gFA==');
    // const cdnUri = `https://rlgkd0v7e.toastcdn.net/mall-configurations/real/${dynamicPart}/mallInfo.js`;

    // fetch(cdnUri)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error('An error occurred while fetching the data.', error);
    //   });

    //////////////////////////////////////////////////////

    // async function fetchEnvironment() {
    //   const response = await fetch('https://dansungbee.shopby.co.kr/environment.json');
    //   const data = await response.json();
    //   return data;
    // }

    // async function fetchMallInfo(clientId) {
    //   const profile = 'real';
    //   const encodedClientId = encodeURIComponent(clientId);
    //   const cdnUri = encodeURI(
    //     `https://rlgkd0v7e.toastcdn.net/mall-configurations/${profile}/${encodedClientId}/mallInfo.js`
    //   );

    //   try {
    //     return await new Promise((resolve, reject) => {
    //       const script = document.createElement('script');
    //       script.src = cdnUri;
    //       script.onload = () => {
    //         if (window.getMalls) {
    //           resolve(window.getMalls());
    //         } else {
    //           reject(new Error('getMalls function not found'));
    //         }
    //       };
    //       script.onerror = () => reject(new Error('Failed to load mall info from CDN'));
    //       document.body.appendChild(script);
    //     });
    //   } catch (error) {
    //     console.warn('Failed to fetch from CDN, falling back to API:', error);
    //     return fetchMallsAPI(clientId);
    //   }
    // }

    // async function fetchMallsAPI(clientId) {
    //   try {
    //     const response = await fetch('https://shop-api.e-ncp.com/malls', {
    //       headers: {
    //         Version: '1.0',
    //         clientId: 'gljUlIkewnw/bs6v/L8gFA==',
    //         platform: 'MOBILE_WEB',
    //       },
    //     });

    //     if (!response.ok) {
    //       console.error('API response not OK:', response.status, response.statusText);
    //       const text = await response.text();
    //       console.error('Response body:', text);
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     console.log('API response data:', data);
    //     return data;
    //   } catch (error) {
    //     console.error('Error in fetchMallsAPI:', error);
    //     throw error;
    //   }
    // }

    // async function initializeShopByAPI() {
    //   try {
    //     console.log('Fetching environment...');
    //     const environment = await fetchEnvironment();
    //     console.log('Environment:', environment);
    //     const { clientId } = environment;

    //     console.log('Fetching mall info...');
    //     const mallInfo = await fetchMallInfo(clientId);

    //     console.log('Mall Info:', mallInfo);
    //   } catch (error) {
    //     console.error('Error initializing ShopBy API:', error);

    //     console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    //   }
    // }

    // initializeShopByAPI();

    /////////////////////
  }, []);

  return (
    <LayoutProvider>
      <div className="page" ref={pageRef}>
        <DesignPopup refs={{ pageInnerRef, pageRef }} />
        {/* area-left */}
        <div className="page__side"></div>
        <BannerProvider>
          <ProductDetailProvider productNo={productNo}>
            <Meta />
            <div className="page-inner" ref={pageInnerRef}>
              {/* banner--left */}
              <article className="page__content banner--left">
                <figure>
                  <AdminBanner bannerId="BNBGLEFT" />
                </figure>
              </article>
              {/* // banner--left */}
              <OffCanvasProvider>
                <div className="page__content site">
                  <Header />
                  <main className="l-content">
                    <Outlet context={platformType} />
                  </main>
                  <Footer />
                  <SearchAddressProvider>
                    <BottomNav />
                  </SearchAddressProvider>
                  {/* <CategoryNav /> */}
                  {/* <span className="fab-top-down">
                    <button className="fab-btn fab-btn--top" onClick={scrollToTop}>
                      <Icon name="angle-down" className="fab-btn__top" />
                    </button>
                  </span> */}
                </div>
              </OffCanvasProvider>
            </div>
          </ProductDetailProvider>
        </BannerProvider>
        {/* area right */}
        <div className="page__side"></div>
      </div>
    </LayoutProvider>
  );
};

// const BottomNavWrap = () => {
//   const { hasBottomNav } = useLayoutValueContext();
//   const [openSearchFullModal, setOpenSearchFullModal] = useState(false);

//   if (hasBottomNav)
//     return (
//       <>
//         <BottomNav search={() => setOpenSearchFullModal(true)} />
//         {openSearchFullModal && <SearchKeyword openModal={setOpenSearchFullModal} />}
//       </>
//     );

//   return <></>;
// };

export default Layout;

Layout.propTypes = {
  isMain: bool,
  hasBottomNav: bool,
  hasHomeBtn: bool,
  hasBackBtn: bool,
  hasCartBtn: bool,
};
