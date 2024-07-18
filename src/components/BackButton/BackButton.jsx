import { useNavigate } from 'react-router-dom';

import { string, func } from 'prop-types';
import { BackIcon } from '../Icon/BackIcon';

const BackButton = ({ label, className, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (history.state && history.state.idx === 0 && history.length <= 0) {
      navigate('/');

      return;
    }

    onClick ? onClick() : navigate(-1);
  };

  return <BackIcon label={label} className={className} icontype="arrow-left" onClick={handleClick} />;
};

export default BackButton;

BackButton.propTypes = {
  label: string,
  className: string,
  onClick: func,
};
