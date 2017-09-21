import * as React from 'react';
import phox from 'phox/typings';
import BackButton from '../back-button/back-button';
import Image from '../image/image';

interface Props {
  images: phox.Image[];
}

const Gallery: React.SFC<Props> = ({ images }) => (
  <div>
    <BackButton destination={{ href: '/' }} />
    {images.map((image: phox.Image): JSX.Element => (
      <Image key={image.fileName} image={image} />
    ))}
    <BackButton destination={{ href: '/' }} />
  </div>
);

export default Gallery;
