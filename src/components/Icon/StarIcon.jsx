import React from 'react';
import PropTypes from 'prop-types';

export function StarIcon({ size = 32, fillPercentage = 100, ...props }) {
  const fillColor = fillPercentage > 0 ? '#FFD700' : '#ccc';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke={fillColor}
      strokeWidth={2}
      width={size}
      height={size}
      {...props}
    >
      <defs>
        <linearGradient id={`starGradient-${fillPercentage}`}>
          <stop offset={`${fillPercentage}%`} stopColor="#FFD700" />
          <stop offset={`${fillPercentage}%`} stopColor="#ccc" />
        </linearGradient>
      </defs>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`url(#starGradient-${fillPercentage})`}
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

StarIcon.propTypes = {
  size: PropTypes.number,
  fillPercentage: PropTypes.number,
};

StarIcon.defaultProps = {
  size: 32,
  fillPercentage: 100,
};
