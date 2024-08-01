import React from 'react';

const ShoppingCartButton = ({ productNo, onClick }) => {
  return (
    <div
      className="small-shopping-cart"
      style={{
        position: 'absolute',
        bottom: '92px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        padding: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 10, // Ensure it's above the image
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: '20px', height: '20px' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    </div>
  );
};

export default ShoppingCartButton;
