import * as React from 'react';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import Link from 'next/link';
import Time from '../time/time';
import styles from './set-list-styles';

interface SetListInterface {
  albums: phox.FrontpageAlbum[];
}

const sortByPublished = (
  a: phox.FrontpageAlbum,
  b: phox.FrontpageAlbum
): number => {
  const publishedA = new Date(a.meta.published).getTime();
  const publishedB = new Date(b.meta.published).getTime();

  if (publishedA === publishedB) {
    return 0;
  }
  return publishedA < publishedB ? 1 : -1;
};

const getAlbumItem = ({
  meta,
  linkProps,
}: phox.FrontpageAlbum): JSX.Element => (
  <li key={meta.title} className={css(styles.item)}>
    <Time date={new Date(meta.published)} className={css(styles.pubdate)} />
    <Link {...linkProps}>
      <a>{meta.title}</a>
    </Link>
  </li>
);

const SetList: React.SFC<SetListInterface> = ({ albums }) => (
  <ul className={css(styles.list)}>
    {albums.sort(sortByPublished).map(getAlbumItem)}
  </ul>
);

export default SetList;
