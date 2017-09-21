import * as React from 'react';
import { css } from 'aphrodite/no-important';
import styles from './comments-styles';

const Comments: React.SFC<{}> = () => (
  <div className={css(styles.comments)}>
    <button className={css(styles.button)} type="button">
      Load Disqus comments 💬
    </button>
  </div>
);

export default Comments;
