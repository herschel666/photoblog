
import gt from 'ramda/src/gt';
import flip from 'ramda/src/flip';
import prop from 'ramda/src/prop';
import length from 'ramda/src/length';
import compose from 'ramda/src/compose';
import { visit } from 'turbolinks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import getDomLoaded from '../util/dom-loaded';
import getKeyDown, {
    KEY_UP,
    KEY_DOWN,
    KEY_ENTER,
} from '../util/get-keydown';

const DIRECTION_UP = 'UP';

const DIRECTION_DOWN = 'DOWN';

const DIRECTION = {
    [KEY_UP]: DIRECTION_UP,
    [KEY_DOWN]: DIRECTION_DOWN,
};

const SELECTOR_IMAGE = '.js-image';

const getImageIds = doc => () => Observable
    .of([...doc.querySelectorAll(SELECTOR_IMAGE)].map(prop('id')));

const hasIds = compose(flip(gt)(0), length, prop('ids'));

const normalizeTarget = (event) => {
    const target = event.target.nodeName.toLowerCase() === 'a'
        ? event.target
        : [...document.getElementsByTagName('a')]
            .filter(elem => elem.contains(event.target))
            .pop();
    return { event, target };
};

const getHash = ({ hash = '' }) => hash.replace(/^#/, '');

const isAnchor = ({ target }) => {
    const hash = getHash(target);
    return target.getAttribute('href').indexOf(hash) === 1;
};

const setImageHash = ({ event, target }) => {
    event.preventDefault();
    location.hash = target.hash;
};

const translateToDirection = directionMap => ({ keyCode }) => ({
    direction: directionMap[keyCode],
});

const getIdsByDirection = (keyEvent$, imageIds$) => Observable
    .combineLatest(keyEvent$, imageIds$, ({ data, event }, ids) =>
        ({ ...data, event, ids }));

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

const jumpToImage = ({ direction, event, ids }) => {
    event.preventDefault();
    const hash = getHash(location);
    const hashIndex = ids.indexOf(hash);
    const nextHash = getNextHash(direction, ids, hashIndex);
    if (nextHash) {
        location.hash = nextHash;
        const { top } = document.getElementById(nextHash).getBoundingClientRect();
        const scrollTarget = window.pageYOffset + top - 10;
        requestAnimationFrame(() => window.scrollTo(0, scrollTarget));
        return;
    }
    history.replaceState({}, document.title, location.href.replace(/#.*$/, ''));
};

const getImageByHash = () => Array
    .of(getHash(location))
    .filter(Boolean)
    .map(document.getElementById.bind(document))
    .shift();

const visitImage = ({ data, event }) => {
    event.preventDefault();
    Array.of(data.querySelector('a'))
        .filter(Boolean)
        .map(prop('href'))
        .forEach(visit);
};

const main = () => {
    Observable
        .fromEvent(document, 'click')
        .map(normalizeTarget)
        .filter(compose(Boolean, prop('target')))
        .filter(isAnchor)
        .subscribe(setImageHash);
    const imageIds$ = getDomLoaded().switchMap(getImageIds(document));
    const keyPressUp$ = getKeyDown(KEY_UP, translateToDirection(DIRECTION));
    const keyPressDown$ = getKeyDown(KEY_DOWN, translateToDirection(DIRECTION));
    const up$ = getIdsByDirection(keyPressUp$, imageIds$);
    const down$ = getIdsByDirection(keyPressDown$, imageIds$);
    Observable.merge(up$, down$)
        .filter(hasIds)
        .subscribe(jumpToImage);
    getKeyDown(KEY_ENTER, getImageByHash).subscribe(visitImage);
};

export default main;
