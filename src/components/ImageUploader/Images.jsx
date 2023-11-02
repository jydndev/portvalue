import { forwardRef } from 'react';

import { arrayOf, string, func, shape, number } from 'prop-types';

import { BOARD_IMAGE } from '../../constants/image';

const Images = forwardRef(({ images, onDelete, configuration = BOARD_IMAGE }, ref) => (
  <ul ref={ref} className="image-uploader__images">
    {images.map((image, index) => (
      <li key={`${index}_${image.originName}`} className="image-uploader__image">
        <img src={`${image.imageUrl}?${configuration.THUMB_NAIL_SIZE}`} alt={image.originName} loading="lazy" />
        <button className="delete" onClick={() => onDelete(image.imageUrl)}>
          <span className="a11y">첨부 이미지 삭제</span>
        </button>
      </li>
    ))}
  </ul>
));

Images.displayName = 'Images';

Images.propTypes = {
  images: arrayOf({
    imageUrl: string,
    originName: string,
  }),
  onDelete: func,
  configuration: shape({
    THUMB_NAIL_SIZE: string,
    LIMIT_COUNT: number,
    LIMIT_MEGA_BYTES: number,
  }),
};

export default Images;
