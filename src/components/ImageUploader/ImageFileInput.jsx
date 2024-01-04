import { forwardRef } from 'react';

import { arrayOf, string, shape, number, func } from 'prop-types';

import { Button } from '@shopby/react-components';

import { BOARD_IMAGE } from '../../constants/image';
import ImageFileUpload from '../ImageFileUpload';

const ImageFileInput = forwardRef(
  ({ images = [], configuration = BOARD_IMAGE, onChangeImages, onClickUploader }, ref) => {
    const handleImageUploadButton = () => {
      ref?.current?.click?.();
      onClickUploader?.();
    };

    const handleImageChange = (selectedImages) => {
      selectedImages.length > 0 && onChangeImages((prev) => [...prev, ...selectedImages]);
    };

    return (
      <>
        <ImageFileUpload
          ref={ref}
          className="image-uploader__file-input"
          onChange={handleImageChange}
          images={images}
          limitFileSizeInMB={configuration.LIMIT_MEGA_BYTES}
          limitCount={configuration.LIMIT_COUNT}
        />
        <Button className="image-uploader__button" label="사진 첨부하기" onClick={handleImageUploadButton} />
        <p className="image-uploader__notice">업로드 용량은 {configuration.LIMIT_MEGA_BYTES}MB 이하로만 가능 합니다.</p>
      </>
    );
  }
);

ImageFileInput.displayName = 'ImageFileInput';
ImageFileInput.propTypes = {
  images: arrayOf({
    imageUrl: string,
    originName: string,
  }),
  configuration: shape({
    THUMB_NAIL_SIZE: string,
    LIMIT_COUNT: number,
    LIMIT_MEGA_BYTES: number,
  }),
  onChangeImages: func,
  onClickUploader: func,
};

export default ImageFileInput;
