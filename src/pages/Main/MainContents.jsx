import { useMemo, useEffect } from 'react';

import { oneOf } from 'prop-types';

import { useProductSectionActionContext, useProductSectionStateContext } from '@shopby/react-components';

import AdminBanner from '../../components/AdminBanner';
import { SECTION_CODE, DISPLAY_SECTION_CODES } from '../../constants/display';

import Hero from './Hero';
import ProductSectionWrap from './ProductSectionWrap';

const RestProductSections = ({ platformType, restProductSections = [] }) => {
  const productSections = restProductSections
    .filter(({ sectionId }) => DISPLAY_SECTION_CODES.includes(sectionId))
    .toSorted((a, b) => a.sectionId.localeCompare(b.sectionId));

  return productSections.map(({ sectionId }) => (
    <ProductSectionWrap key={sectionId} platformType={platformType} sectionsId={sectionId} />
  ));
};

const MainContents = ({ platformType }) => {
  const { displaySections } = useProductSectionStateContext();
  const { fetchAllProductSections } = useProductSectionActionContext();

  const restProductSections = useMemo(
    () => displaySections.filter(({ sectionId }) => !SECTION_CODE[platformType].includes(sectionId)),
    [displaySections]
  );

  useEffect(() => {
    fetchAllProductSections();
  }, []);

  return (
    <div className="main-view">
      <Hero bannerId="BNSLIDE" />
      <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][0]} />
      <AdminBanner bannerId="BANNER01" />
      <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][1]} />
      <AdminBanner bannerId="BANNER02" />
      <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][2]} />
      <AdminBanner bannerId="BANNER03" />
      <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][3]} />
      <AdminBanner className="mb-30" bannerId="BANNER04" />
      <AdminBanner bannerId="BANNER05" />
      <ProductSectionWrap platformType={platformType} sectionsId={SECTION_CODE[platformType][4]} />
      <AdminBanner bannerId="BNBOTTOM" />

      <RestProductSections platformType={platformType} restProductSections={restProductSections} />
    </div>
  );
};

export default MainContents;

MainContents.propTypes = {
  platformType: oneOf(['PC', 'MOBILE_WEB', 'MOBILE_APP']),
};
