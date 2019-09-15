import React from 'react';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import { useLink } from './page-context';
import styles from './set-list.module.css';

export interface Album {
  id: string;
  slug: string;
  title: string;
  date: string;
  niceDate: string;
  poster: FluidObject;
}

interface Props {
  albums: Album[];
}

const SetList: React.SFC<Props> = ({ albums }) => {
  const Link = useLink();

  return (
    <ul className={styles.list}>
      {albums.map(({ id, slug, title, date, niceDate, poster }) => (
        <li key={id} className={styles.item}>
          <time dateTime={date} className={styles.pubdate}>
            {niceDate}
          </time>
          <Link to={slug} className={styles.caption}>
            {title}
          </Link>
          <Link to={slug} className={styles.poster}>
            <GatsbyImage fluid={poster} alt="" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SetList;
