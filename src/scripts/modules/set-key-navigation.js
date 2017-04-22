
import gt from 'ramda/src/gt';
import flip from 'ramda/src/flip';
import prop from 'ramda/src/prop';
import length from 'ramda/src/length';
import equals from 'ramda/src/equals';
import compose from 'ramda/src/compose';
import { visit } from 'turbolinks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import getDomLoaded from '../util/dom-loaded';

const KEY_UP = 38;

const KEY_DOWN = 40;

const KEY_ENTER = 13;

const DIRECTION_UP = 'UP';

const DIRECTION_DOWN = 'DOWN';

const DIRECTION = {
    [KEY_UP]: DIRECTION_UP,
    [KEY_DOWN]: DIRECTION_DOWN,
};

const SELECTOR_IMAGE = '.js-image';

const getImageIds = () => Observable
    .of([...document.querySelectorAll(SELECTOR_IMAGE)].map(prop('id')));

const normalizeTarget = (event) => {
    const target = event.target.nodeName.toLowerCase() === 'a'
        ? event.target
        : [...document.getElementsByTagName('a')]
            .filter(elem => elem.contains(event.target))
            .pop();
    return { event, target };
};

const hasTarget = ({ target }) => Boolean(target);

const getHash = ({ hash }) => (hash || '').replace(/^#/, '');

const isAnchor = ({ target }) => {
    const hash = getHash(target);
    return target.getAttribute('href').indexOf(hash) === 1;
};

const setImageHash = ({ event, target }) => {
    event.preventDefault();
    location.hash = target.hash;
};

const getKeyDown = (keyDown$, keyCode) => keyDown$
    .map(prop('keyCode'))
    .filter(equals(keyCode))
    .mapTo(DIRECTION[keyCode]);

const getIdsByDirection = (keyEvent$, imageIds$) =>
    Observable
        .combineLatest(keyEvent$, imageIds$, (direction, ids) => ({ direction, ids }));

const getNearestImageId = (ids, isUp) => prop('id', ids
    .map((id) => {
        const elem = document.getElementById(id);
        const top = elem ? (elem.getBoundingClientRect() || {}).top : null;
        return { top, id };
    })
    .filter(({ top }) => {
        if (isUp) {
            return top < 0;
        }
        return top > 0;
    })
    .reduce((last, { top, id }) => {
        const normalizedTop = Math.sqrt(top ** 2);
        if (normalizedTop < last.top) {
            return { top: normalizedTop, id };
        }
        return Object.assign({}, last);
    }, { top: 999999 }));

const getNextHash = (direction, ids, hashIndex) => {
    const isUp = direction === DIRECTION_UP;
    const isDown = direction === DIRECTION_DOWN;
    const lastIndex = ids.length - 1;
    if ((hashIndex === 0 && isUp) || (hashIndex === lastIndex && isDown)) {
        return null;
    }
    if (hashIndex === -1) {
        return getNearestImageId(ids, isUp);
    }
    const nextIndex = isUp ? hashIndex - 1 : hashIndex + 1;
    return ids[nextIndex];
};

const jumpToImage = ({ direction, ids }) => {
    const hash = getHash(location);
    const hashIndex = ids.indexOf(hash);
    const nextHash = getNextHash(direction, ids, hashIndex);
    if (nextHash) {
        location.hash = nextHash;
        const { top } = document.getElementById(nextHash).getBoundingClientRect();
        const scrollTarget = window.pageYOffset + top - 10;
        requestAnimationFrame(() => window.scrollTo(0, scrollTarget));
    }
};

const getImageByHash = () => {
    const hash = getHash(location);
    return hash ? document.getElementById(hash) : null;
};

const visitImage = (elem) => {
    const anchor = elem.querySelector('a');
    if (anchor) {
        visit(anchor.href);
    }
};

const main = () => {
    Observable
        .fromEvent(document, 'click')
        .map(normalizeTarget)
        .filter(hasTarget)
        .filter(isAnchor)
        .subscribe(setImageHash);
    const imageIds$ = getDomLoaded().switchMap(getImageIds);
    const keyDown$ = Observable.fromEvent(document, 'keydown');
    const up$ = getIdsByDirection(getKeyDown(keyDown$, KEY_UP), imageIds$);
    const down$ = getIdsByDirection(getKeyDown(keyDown$, KEY_DOWN), imageIds$);
    Observable.merge(up$, down$)
        .filter(compose(flip(gt)(0), length, prop('ids')))
        .subscribe(jumpToImage);
    getKeyDown(keyDown$, KEY_ENTER)
        .map(getImageByHash)
        .filter(Boolean)
        .subscribe(visitImage);
};

export default main;
