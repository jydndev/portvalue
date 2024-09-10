import { createContext, useState, useContext } from 'react';

const CartBottomSheetContext = createContext();

export const CartBottomSheetProvider = ({ children }) => {
  const [openProductNo, setOpenProductNo] = useState(null);

  const openBottomSheet = (productNo) => {
    setOpenProductNo(productNo);
  };

  const closeBottomSheet = () => {
    setOpenProductNo(null);
  };

  return (
    <CartBottomSheetContext.Provider value={{ openProductNo, openBottomSheet, closeBottomSheet }}>
      {children}
    </CartBottomSheetContext.Provider>
  );
};

export const useCartBottomSheet = () => useContext(CartBottomSheetContext);
