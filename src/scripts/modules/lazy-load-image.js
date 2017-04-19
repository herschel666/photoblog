
import identity from 'ramda/src/identity';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import getDomLoaded from '../util/dom-loaded';

const TOLERANCE = 200;

const getDelayedImageStream = imgs => Observable.of(...imgs).zip(
    Observable.interval(20).take(imgs.length), identity);

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
    const domLoaded$ = getDomLoaded();
    const windowScroll$ = Observable.fromEvent(window, 'scroll');
    const windowResize$ = Observable.fromEvent(window, 'resize');
    const windowEvents$ = windowScroll$
        .merge(windowResize$)
        .debounceTime(20)
        .startWith('scroll');
    const images$ = domLoaded$.switchMap(() =>
        Observable.of(document.querySelectorAll('img[data-src-set]')))
            .filter(imgs => imgs.length)
            .switchMap(getDelayedImageStream);
    windowEvents$
        .switchMap(() => images$)
        .filter(isInViewport)
        .subscribe(setSrcSet);
};

export default main;
