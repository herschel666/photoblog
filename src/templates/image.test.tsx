import React, { FC } from 'react';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { GatsbyLinkProps } from 'gatsby';
import type { FluidObject } from 'gatsby-image';

import Image from './image';

jest.mock('gatsby', () => ({
  graphql: () => '',
}));
jest.mock('gatsby-image', () => {
  const GatsbyImage: FC<{ fluid: FluidObject; alt: string }> = ({
    fluid,
    alt,
  }) => <img src={fluid.src} alt={alt} />;
  return GatsbyImage;
});
jest.mock('../components/layout', () => {
  const Layout: FC = ({ children }) => <>{children}</>;
  return Layout;
});
jest.mock('../components/seo', () => () => null);
jest.mock('../components/page-context', () => {
  const useLink = (): FC<
    Pick<GatsbyLinkProps<unknown>, 'to' | 'className'> & {
      'data-testid': string;
    }
    // eslint-disable-next-line react/display-name
  > => ({ to, className, children }) => (
    <a href={to} className={className}>
      {children}
    </a>
  );
  return { useLink };
});

describe('template::image', () => {
  const src = '/path/to/image.jpg';
  const frontmatter = {
    title: 'A test image',
    description: 'Describe the test image...',
    date: '2020-08-11T19:38:38.737Z',
    niceDate: '2020/08/11 19:38',
  };
  const exif = {
    latitude: 53.55812,
    longitude: 9.914753333333334,
    camera: 'NIKON D300S',
    lens: '18.0-70.0 mm f/3.5-4.5',
    iso: 100,
    aperture: 4.0,
    focalLength: 18.0,
    exposureTime: 5,
    flash: false,
  };
  const file = {
    fields: { exif },
    original: {
      width: 2000,
      height: 1000,
    },
    fluid: { src } as FluidObject,
    og: { src },
  };
  const prev = {
    fields: { slug: '/lorem' },
    frontmatter: { title: 'The previous image' },
  };
  const next = {
    fields: { slug: '/ipsum' },
    frontmatter: { title: 'The next image' },
  };
  const image = {
    fields: { set: 'Foo', slug: '/bar' },
    html: '<p>Lorem ipsum.</p>',
    frontmatter,
  };
  const data = {
    site: {
      siteMetadata: {
        siteUrl: 'http://localhost',
      },
    },
    image,
    file,
    prev,
    next,
  };
  let getByText: RenderResult['getByText'];
  let getByAltText: RenderResult['getByAltText'];
  let getByTestId: RenderResult['getByTestId'];

  beforeEach(() => {
    const page = render(<Image data={data} path="/image" />);
    getByText = page.getByText;
    getByAltText = page.getByAltText;
    getByTestId = page.getByTestId;
  });

  it('has a heading', () => {
    getByText(frontmatter.title);
  });

  it('has a share button', () => {
    getByText('Share');
  });

  it('has an image', () => {
    getByAltText(frontmatter.title);
  });

  it('has a date', () => {
    const elem = getByText(frontmatter.niceDate) as HTMLTimeElement;
    expect(elem.dateTime).toBe(frontmatter.date);
  });

  it('has an image description', () => {
    getByText('Lorem ipsum.');
  });

  it('links to the next image', () => {
    const elem = getByText(next.frontmatter.title) as HTMLAnchorElement;
    expect(elem.getAttribute('href')).toBe(`${next.fields.slug}#main-content`);
  });

  it('links to the previous image', () => {
    const elem = getByText(prev.frontmatter.title) as HTMLAnchorElement;
    expect(elem.getAttribute('href')).toBe(`${prev.fields.slug}#main-content`);
  });

  it('displays the image meta', () => {
    getByText(`${exif.camera}, ${exif.lens}`);
    getByText(String(exif.aperture), { selector: '.definition' });
    getByText(`${exif.focalLength} mm`, { selector: '.definition' });
    getByText(String(exif.exposureTime), { selector: '.definition' });
    getByText(String(exif.iso), { selector: '.definition' });
    getByText('No', { selector: '.definition' });
  });

  it('has an Open Streetmap', () => {
    const map = getByTestId('osm-iframe') as HTMLIFrameElement;
    const anchor = getByTestId('osm-link') as HTMLAnchorElement;
    expect(
      map.src.startsWith('https://www.openstreetmap.org/export/embed.html')
    ).toBe(true);
    expect(map.src).toContain(exif.longitude - 0.0015);
    expect(map.src).toContain(exif.latitude - 0.0005);
    expect(map.src).toContain(exif.longitude + 0.0015);
    expect(map.src).toContain(exif.latitude + 0.0005);
    expect(map.src).toContain('layer=mapnik');
    expect(map.src).toContain(`marker=${exif.latitude}%2C${exif.longitude}`);
    expect(anchor.href.startsWith('https://www.openstreetmap.org')).toBe(true);
    expect(anchor.href).toContain(`mlat=${exif.latitude}`);
    expect(anchor.href).toContain(`mlon=${exif.longitude}`);
    expect(anchor.href).toContain(`#map=19/${exif.latitude}/${exif.longitude}`);
  });
});
