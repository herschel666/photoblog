
import prop from 'ramda/src/prop';
import equals from 'ramda/src/equals';
import { visit } from 'turbolinks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

const KEY_LEFT = 37;

const KEY_RIGHT = 39;

const directionSelectors = {
    [KEY_LEFT]: 'a[data-prev-image="true"]',
    [KEY_RIGHT]: 'a[data-next-image="true"]',
};

const getHrefFromElement = (selector) => {
    const elem = document.querySelector(selector);
    if (!elem) {
        return null;
    }
    return elem.href;
};

const getKeyDown = (keyDown$, keyCode) => keyDown$
    .map(prop('keyCode'))
    .filter(equals(keyCode))
    .map(code => directionSelectors[code])
    .map(getHrefFromElement)
    .filter(Boolean);

const main = () => {
    const keyDown$ = Observable.fromEvent(document, 'keydown');
    const leftPress$ = getKeyDown(keyDown$, KEY_LEFT);
    const rightPress$ = getKeyDown(keyDown$, KEY_RIGHT);
    Observable.merge(leftPress$, rightPress$).subscribe(visit);
};

export default main;
