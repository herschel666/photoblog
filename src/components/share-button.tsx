import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

import styles from './share-button.module.css';
import { VisuallyHidden } from './visually-hidden';

interface Props {
  url: string;
  title: string;
}

const canShare = () => {
  return (
    typeof window.navigator.canShare === 'function' &&
    window.navigator.canShare()
  );
};
// tslint:disable-next-line max-func-body-length
const ShareButton: React.FC<Props> = ({ url, title }) => {
  const content = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const shareMenuToggle = React.useRef<
    (evnt?: React.SyntheticEvent<HTMLButtonElement>) => void
  >(() => {
    // empty
  });
  const menu = React.useRef<HTMLDivElement | null>(null);
  const button = React.useRef<HTMLButtonElement | null>(null);
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const closeOnClickAnywhere = React.useRef<(evnt: MouseEvent) => void>(
    (evnt) => {
      if (
        menu.current &&
        evnt.target &&
        !menu.current.contains(evnt.target as Node)
      ) {
        // tslint:disable-next-line no-use-before-declare
        shareMenuToggle.current();
      }
    }
  );
  const closeOnEscPress = React.useRef<(evnt: KeyboardEvent) => void>(
    (evnt) => {
      if (evnt.keyCode === 27) {
        // tslint:disable-next-line no-use-before-declare
        shareMenuToggle.current();
        if (button.current) {
          button.current.focus();
        }
      }
    }
  );

  shareMenuToggle.current = (evnt) => {
    if (evnt) {
      evnt.stopPropagation();
    }

    if (canShare() && typeof window.navigator.share === 'function') {
      // tslint:disable-next-line no-floating-promises
      window.navigator.share({ url, title });
    } else {
      if (menuVisible) {
        setMenuVisible(false);
        document.removeEventListener('click', closeOnClickAnywhere.current);
        document.removeEventListener('keyup', closeOnEscPress.current);
      } else {
        setMenuVisible(true);
        document.addEventListener('click', closeOnClickAnywhere.current);
        document.addEventListener('keyup', closeOnEscPress.current);
        requestAnimationFrame(() => {
          if (menu.current) {
            menu.current.focus();
          }
        });
      }
    }
  };
  const share = (platform: 'twitter' | 'facebook') => () => {
    switch (platform) {
      case 'twitter': {
        const twitterUrl = `https://twitter.com/share?url=${shareUrl}&text=${content}&via=Herschel_R`;
        window.open(twitterUrl);
        break;
      }
      case 'facebook': {
        const facebookUrl = `https://www.facebook.com/sharer.php?u=${shareUrl}`;
        window.open(facebookUrl);
      }
    }
    shareMenuToggle.current();
  };
  const menuTabIndex = menuVisible ? 0 : -1;

  return (
    <div className={styles.wrap}>
      <button
        ref={button}
        onClick={shareMenuToggle.current}
        className={styles.shareButton}
        aria-haspopup="true"
        aria-expanded={menuVisible}
      >
        Share
      </button>
      <div
        ref={menu}
        hidden={!menuVisible}
        tabIndex={menuTabIndex}
        className={styles.menu}
      >
        <button onClick={share('twitter')} className={styles.socialButton}>
          <VisuallyHidden>Share current page on twitter</VisuallyHidden>
          <Icon
            icon={faTwitter}
            className={classNames(styles.icon, styles.twitter)}
          />
        </button>
        <button onClick={share('facebook')} className={styles.socialButton}>
          <VisuallyHidden>Share current page on Facebook</VisuallyHidden>
          <Icon
            icon={faFacebook}
            className={classNames(styles.icon, styles.facebook)}
          />
        </button>
      </div>
    </div>
  );
};

export default ShareButton;
