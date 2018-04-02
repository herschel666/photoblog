import * as React from 'react';
import phox from 'phox/typings';
import BackButton from '../back-button/back-button';
import Photo from '../photo/photo';
import InViewPort, {
  State as InViewPortState,
} from '../in-viewport/in-viewport';

interface GalleryInterface {
  images: phox.Image[];
}

const lazyLoadImage = (image: phox.Image) => (
  state: InViewPortState
): JSX.Element => <Photo image={image} load={state.inViewPort} />;

const Gallery: React.SFC<GalleryInterface> = ({ images }) => (
  <React.Fragment>
    <BackButton destination={{ href: '/' }} />
    {images.map((image: phox.Image): JSX.Element => (
      <InViewPort key={image.fileName} render={lazyLoadImage(image)} />
    ))}
    <BackButton destination={{ href: '/' }} />
  </React.Fragment>
);

export default Gallery;
