import React, { FC } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { navigate } from 'gatsby';
import type { GatsbyLinkProps } from 'gatsby';

import ImageNav from './image-nav';

jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));
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

describe('component::image-nav', () => {
  const prevTo = '/prev-img';
  const prevCaption = 'The previous image';
  const nextTo = '/next-img';
  const nextCaption = 'The next image';
  const props = { prevTo, prevCaption, nextTo, nextCaption };

  beforeEach(() => {
    render(<ImageNav {...props} />);
  });

  afterEach(() => {
    (navigate as jest.Mock).mockClear();
  });

  it('navigates to previous image on right arrow hit', async () => {
    fireEvent.keyDown(document, { key: 'ArrowRight' });

    expect(navigate).toHaveBeenCalledWith(`${prevTo}#main-content`);
  });

  it('navigates to next image on left arrow hit', async () => {
    fireEvent.keyDown(document, { key: 'ArrowLeft' });

    expect(navigate).toHaveBeenCalledWith(`${nextTo}#main-content`);
  });
});
