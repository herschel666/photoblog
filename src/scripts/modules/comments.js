
/* eslint "camelcase": 0 */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import domLoaded$ from '../util/dom-loaded';

const LOAD_COMMENTS_ID = 'load-disqus_thread';

const getDisqusConfig = () => function disqus_config() {
    this.page.url = location.href;
    this.page.identifier = location.pathname;
};

const isLoadButtonClick = ({ target }) =>
    target.id === LOAD_COMMENTS_ID;

const removeButton = ({ target }) =>
    target.parentNode.removeChild(target);

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
    document.head.appendChild(elem);
};

const main = () => Observable
    .fromEvent(document.body, 'click')
    .filter(isLoadButtonClick)
    .do(removeButton)
    .do(loadCommentsScript)
    .switchMap(() => domLoaded$
        .map(() => document.getElementById(LOAD_COMMENTS_ID))
        .filter(Boolean))
    .subscribe((btn) => {
        btn.parentNode.removeChild(btn);
        loadCommentsScript();
    });

window.disqus_config = getDisqusConfig();

export default main;
