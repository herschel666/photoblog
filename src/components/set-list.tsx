import React from 'react';
import { Link } from 'gatsby';

import styles from './set-list.module.css';

export interface Album {
  id: string;
  slug: string;
  title: string;
  date: string;
  niceDate: string;
}

interface Props {
  albums: Album[];
}

const SetList: React.SFC<Props> = ({ albums }) => (
  <ul className={styles.list}>
    {albums.map(({ id, slug, title, date, niceDate }) => (
      <li key={id} className={styles.item}>
        <time dateTime={date} className={styles.pubdate}>
          {niceDate}
        </time>
        <Link to={slug}>{title}</Link>
      </li>
    ))}
  </ul>
);

export default SetList;
