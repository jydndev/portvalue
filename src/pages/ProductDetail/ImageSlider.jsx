import { useMemo } from 'react';

import {
  Slider,
  Slide,
  ThumbItem,
  useProductDetailStateContext,
  Skeleton,
  VisibleComponent,
} from '@shopby/react-components';

const ImageSlider = () => {
  const {
    productDetail: { images, baseInfo },
  } = useProductDetailStateContext();

  const sliderConfig = useMemo(
    () => ({
      pagination: {
        clickable: true,
      },
      navigation: false,
      loop: false,
      slidesPerView: 'auto',
    }),
    [images]
  );

  return (
    <>
      <VisibleComponent
        shows={images.length > 0}
        TruthyComponent={
          <Slider className="product-image-slider" {...sliderConfig}>
            {images.map((imageInfo, idx) => (
              <Slide key={idx}>
                <ThumbItem
                  {...imageInfo}
                  href={`/product-detail?productNo=${baseInfo?.productNo}`}
                  productNo={baseInfo?.productNo}
                  resize="500x500"
                />
              </Slide>
            ))}
          </Slider>
        }
        FalsyComponent={<Skeleton type="SQUARE" />}
      />
    </>
  );
};

export default ImageSlider;
