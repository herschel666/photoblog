
import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import { visit } from 'turbolinks';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import getKeyDown, {
    KEY_LEFT,
    KEY_RIGHT,
    KEY_BACK,
    KEY_ESCAPE,
} from '../util/get-keydown';

const SELECTOR_BACK_LINK = '.js-back-to-set';

const directionSelectors = {
    [KEY_LEFT]: 'a[data-prev-image="true"]',
    [KEY_RIGHT]: 'a[data-next-image="true"]',
};

const getSelectorByDirection = selectorMap =>
    ({ keyCode }) => selectorMap[keyCode];

const getHrefFromElement = doc => selector =>
    Array.of(doc.querySelector(selector))
        .filter(Boolean)
        .map(prop('href'))
        .shift();

const leftRightMap = (doc, selectorMap) =>
    compose(getHrefFromElement(doc), getSelectorByDirection(selectorMap));

const visitPage = ({ data, event }) => {
    event.preventDefault();
    visit(data);
};

const getBackLink = doc => ({ event }) => ({
    elem: doc.querySelector(SELECTOR_BACK_LINK),
    event,
});

const goBack = ({ event, elem }) => {
    event.preventDefault();
    Array.of(elem).map(prop('href')).forEach(visit);
};

const main = () => {
    const mapFn = leftRightMap(document, directionSelectors);
    const leftPress$ = getKeyDown(KEY_LEFT, mapFn);
    const rightPress$ = getKeyDown(KEY_RIGHT, mapFn);
    const backPress$ = getKeyDown(KEY_BACK);
    const escapePress$ = getKeyDown(KEY_ESCAPE);

    Observable.merge(leftPress$, rightPress$).subscribe(visitPage);
    Observable.merge(backPress$, escapePress$)
        .map(getBackLink(document))
        .filter(compose(Boolean, prop('elem')))
        .subscribe(goBack);
};

export default main;
