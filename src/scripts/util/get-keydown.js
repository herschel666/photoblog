
import identity from 'ramda/src/identity';
import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

export const KEY_LEFT = 37;

export const KEY_UP = 38;

export const KEY_RIGHT = 39;

export const KEY_DOWN = 40;

export const KEY_ENTER = 13;

export const KEY_BACK = 8;

export const KEY_ESCAPE = 27;

const mapToData = mapFn => event => ({
    ...{ data: mapFn(event) },
    ...{ event },
});

export default function getKeyDown(keyCode, mapFn = identity) {
    return Observable
        .fromEvent(document, 'keydown')
        .filter(propEq('keyCode', keyCode))
        .map(mapToData(mapFn))
        .filter(compose(Boolean, prop('data')));
}
