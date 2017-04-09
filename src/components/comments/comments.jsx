
import React from 'react';
import styles from './comments.sass';

const Comments = () => (
    <div className={styles.comments} id="disqus_thread">
        <button className={styles.button} type="button" id="load-disqus_thread">
            Load Disqus comments &hellip;
        </button>
    </div>
);

export default Comments;
