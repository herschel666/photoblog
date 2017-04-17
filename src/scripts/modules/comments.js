
/* eslint "camelcase": 0 */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';

const LOAD_COMMENTS_ID = 'load-disqus_thread';

const COMMENTS_ID = 'disqus_thread';

const getDisqusConfig = () => function disqus_config() {
    this.page.url = location.href;
    this.page.identifier = location.pathname;
    this.page.title = document.title;
};

const isLoadButtonClick = ({ target }) =>
    target.id === LOAD_COMMENTS_ID;

const getCommentWrapper = () => document.getElementById(LOAD_COMMENTS_ID);

const loadCommentsScript = () => {
    if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
        window.DISQUS.reset({
            reload: true,
            config: getDisqusConfig(),
        });
        return;
    }
    const elem = document.createElement('script');
    elem.src = 'https://ek-photos.disqus.com/embed.js';
    elem.setAttribute('data-timestamp', Date.now());
    elem.setAttribute('data-turbolinks-track', 'reload');
    document.head.appendChild(elem);
};

const main = () => Observable
    .fromEvent(document, 'click')
    .filter(isLoadButtonClick)
    .map(getCommentWrapper)
    .filter(Boolean)
    .subscribe((btn) => {
        btn.parentNode.setAttribute('id', COMMENTS_ID);
        btn.parentNode.removeChild(btn);
        loadCommentsScript();
    });

window.disqus_config = window.disqus_config || getDisqusConfig();

export default main;
