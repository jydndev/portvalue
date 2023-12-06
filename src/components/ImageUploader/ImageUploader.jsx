import { useRef } from 'react';

import { shape, object, bool, arrayOf, func, string, number } from 'prop-types';

import { ImageFileProvider, VisibleComponent } from '@shopby/react-components';

import ImageFileInput from './ImageFileInput';
import Images from './Images';

const ImageUploader = ({
  canAttach,
  images,
  onChangeImages,
  onDeleteImage,
  onClickUploader,
  configuration,
  refs = {},
}) => {
  const { imagesRef = useRef(), uploaderRef = useRef() } = refs;

  const handleDeleteImage = (imageUrl) => {
    onChangeImages((prev) => prev.filter((image) => image.imageUrl !== imageUrl));
    onDeleteImage?.(imageUrl);
  };

  return (
    <div className="image-uploader">
      <ImageFileProvider>
        <Images ref={imagesRef} images={images} onDelete={handleDeleteImage} configuration={configuration} />
        <VisibleComponent
          shows={canAttach}
          TruthyComponent={
            <ImageFileInput
              ref={uploaderRef}
              images={images}
              configuration={configuration}
              onChangeImages={onChangeImages}
              onClickUploader={onClickUploader}
            />
          }
        />
      </ImageFileProvider>
    </div>
  );
};

export default ImageUploader;

ImageUploader.propTypes = {
  refs: shape({
    imagesRef: object,
    uploaderRef: object,
  }),
  images: arrayOf({
    imageUrl: string,
    originName: string,
  }),
  canAttach: bool,
  onChangeImages: func,
  onDeleteImage: func,
  onClickUploader: func,
  configuration: shape({
    THUMB_NAIL_SIZE: string,
    LIMIT_COUNT: number,
    LIMIT_MEGA_BYTES: number,
  }),
};
