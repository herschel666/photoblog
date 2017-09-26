import * as React from 'react';
import Link from 'next/link';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import styles from './back-button-styles';

interface Destination {
  href:
    | string
    | {
        pathname: string;
        query?: { [x: string]: string };
      };
  // tslint:disable-next-line:no-reserved-keywords
  as?:
    | string
    | {
        pathname: string;
      };
}

interface BackButtonInterface {
  destination: Destination | phox.LinkProps;
}

const BackButton: React.SFC<BackButtonInterface> = ({ destination }) => (
  <div className={css(styles.wrap)}>
    <Link {...destination}>
      <a className={css(styles.button)}>back</a>
    </Link>
  </div>
);

export default BackButton;
