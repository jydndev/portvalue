import { useEffect } from 'react';

import { oneOf } from 'prop-types';

import { useProductSectionActionContext } from '@shopby/react-components';

import AdminBanner from '../../components/AdminBanner';
import { SECTION_CODE } from '../../constants/display';

import Hero from './Hero';
import ProductSection from './ProductSection';
import CategoryNavigation from '../../components/CategoryNavigation/CategoryNavigation';

const MainContents = ({ platformType }) => {
  const { fetchDisplaySections } = useProductSectionActionContext();

  useEffect(() => {
    fetchDisplaySections({ sectionCodes: SECTION_CODE[platformType] });
  }, []);

  return (
    <div className="main-view">
      <Hero bannerId="BNSLIDE" />
      <CategoryNavigation platformType={platformType} />
      <ProductSection platformType={platformType} sectionsId={SECTION_CODE[platformType][0]} />
      <AdminBanner bannerId="BANNER01" />
      <ProductSection platformType={platformType} sectionsId={SECTION_CODE[platformType][1]} />
      <AdminBanner bannerId="BANNER02" />
      <ProductSection platformType={platformType} sectionsId={SECTION_CODE[platformType][2]} />
      <AdminBanner bannerId="BANNER03" />
      <ProductSection platformType={platformType} sectionsId={SECTION_CODE[platformType][3]} />
      <AdminBanner className="mb-30" bannerId="BANNER04" />
      <AdminBanner bannerId="BANNER05" />
      <ProductSection platformType={platformType} sectionsId={SECTION_CODE[platformType][4]} />
      <AdminBanner bannerId="BNBOTTOM" />
    </div>
  );
};

export default MainContents;

MainContents.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
};
