import {
  ProfileLikeProvider,
  useProfileLikeStateContext,
  ProductInquiryProvider,
  ProductInquiryFormProvider,
  CartProvider,
  ProductOptionProvider,
} from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';
import TotalCount from '../TotalCount';

import LikeList from './LikeList';

const LikeTotalCount = () => {
  const { profileLikeProduct } = useProfileLikeStateContext();

  return <TotalCount title="찜한 상품" count={profileLikeProduct.totalCount} />;
};

const Like = () => {
  useLayoutChanger({
    title: '찜한 상품',
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ProfileLikeProvider>
      <ProductInquiryProvider>
        <ProductInquiryFormProvider>
          <ProductOptionProvider>
            <CartProvider>
              <div className="profile-like">
                <LikeTotalCount />
                <LikeList />
              </div>
            </CartProvider>
          </ProductOptionProvider>
        </ProductInquiryFormProvider>
      </ProductInquiryProvider>
    </ProfileLikeProvider>
  );
};

export default Like;
