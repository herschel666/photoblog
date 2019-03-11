import * as React from 'react';
import { css } from 'aphrodite/no-important';
import { windowIsDefined } from '../../util';
import styles from './comments-styles';

interface CommentsInterface {
  url: string;
}

interface Disqus {
  page: {
    url?: string;
    identifier?: string;
    title?: string;
  };
}

function disqus_config() {
  // @ts-ignore
  // tslint:disable-next-line:no-invalid-this
  const that = this as Disqus;
  that.page.url = location.href;
  that.page.identifier = location.pathname;
  that.page.title = document.title;
}

export default class Comments extends React.Component<CommentsInterface> {
  private readonly COMMENTS_ID: string = 'disqus_thread';
  private elem?: HTMLElement;

  private readonly loadDisqus = (
    evnt: React.SyntheticEvent<HTMLButtonElement>
  ): void => {
    if (evnt.currentTarget && evnt.currentTarget.parentElement) {
      const elem = document.createElement('script');
      this.elem = evnt.currentTarget.parentElement;
      this.elem.setAttribute('id', this.COMMENTS_ID);
      elem.src = 'https://ek-photos.disqus.com/embed.js';
      elem.setAttribute('data-timestamp', String(Date.now()));
      elem.setAttribute('data-turbolinks-track', 'reload');
      document.head.appendChild(elem);
    }
  };

  private readonly resetDisqus = (): void => {
    if (windowIsDefined()) {
      // Delay to ensure the HTML is there for to
      // the widget to mount properly
      requestAnimationFrame(() => {
        if (window.DISQUS) {
          window.DISQUS.reset({
            reload: true,
            config: disqus_config,
          });
        }
      });
    }
  };

  public componentWillMount(): void {
    if (!windowIsDefined()) {
      return;
    }

    window.disqus_config = window.disqus_config || disqus_config;
    this.resetDisqus();
  }

  public componentWillReceiveProps(nextProps: CommentsInterface): void {
    if (nextProps.url !== this.props.url) {
      this.resetDisqus();
    }
  }

  public componentWillUnmount(): void {
    if (window.DISQUS) {
      window.DISQUS.reset({ reload: false });
    }
  }

  public render() {
    const disqusLoaded = windowIsDefined() && Boolean(window.DISQUS);
    const elemId = disqusLoaded ? this.COMMENTS_ID : undefined;
    return (
      <div className={css(styles.comments)} id={elemId}>
        <button
          className={css(styles.button, disqusLoaded && styles.disqusLoaded)}
          type="button"
          onClick={this.loadDisqus}
        >
          Load Disqus comments 💬
        </button>
      </div>
    );
  }
}
