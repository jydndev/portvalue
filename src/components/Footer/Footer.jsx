import { useMemo } from 'react';

import { useTermsStateContext } from '@shopby/react-components';

import { TERMS_MENUS } from '../../constants';

import ServiceInformation from './ServiceInformation';

const Footer = () => {
  const { terms } = useTermsStateContext();

  const services = useMemo(
    () =>
      TERMS_MENUS.map((menu) => {
        const _terms = terms[menu.termsKey];
        return _terms ? { ...menu, ..._terms } : menu;
      }).filter(({ used }) => used),
    [terms]
  );

  return (
    <footer className="footer">
      <ServiceInformation services={services} />
    </footer>
  );
};

export default Footer;
