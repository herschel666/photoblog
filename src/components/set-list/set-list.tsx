import * as React from 'react';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import Link from 'next/link';
import { sortBy, prop } from 'ramda';
import Time from '../time/time';
import styles from './set-list-styles';

interface SetListInterface {
  albums: phox.FrontpageAlbum[];
}

const sortByPublished = sortBy(prop('published'));

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
    {sortByPublished(albums)
      .reverse()
      .map(getAlbumItem)}
  </ul>
);

export default SetList;
