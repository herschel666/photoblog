
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import domLoaded$ from '../util/dom-loaded';

const TOLERANCE = 50;

const isInViewport = (img) => {
    const { top } = img.getBoundingClientRect();
    if (top - TOLERANCE < window.innerHeight) {
        return true;
    }
    return false;
};

const setSrcSet = (img) => {
    const srcset = img.getAttribute('data-src-set');
    const src = img.getAttribute('data-src');
    if (!srcset || !src) {
        return;
    }
    img.removeAttribute('data-src-set');
    img.removeAttribute('data-src');
    img.removeAttribute('style');
    Object.assign(img, { srcset, src });
};

const main = () => {
    const windowScroll$ = Observable.fromEvent(window, 'scroll');
    const windowResize$ = Observable.fromEvent(window, 'resize');
    const windowEvents$ = windowScroll$
        .merge(windowResize$)
        .debounceTime(20)
        .startWith('scroll');
    const images$ = domLoaded$.switchMap(() =>
        Observable.of(document.querySelectorAll('img[data-src-set]')))
            .filter(img => img.length)
            .switchMap(imgs => Observable.of(...imgs));
    windowEvents$
        .switchMap(() => images$)
        .filter(isInViewport)
        .subscribe(setSrcSet);
};

export default main;
