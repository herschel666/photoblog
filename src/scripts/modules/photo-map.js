
/* eslint "global-require": 0 */
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import merge from 'ramda/src/merge';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import getDomLoaded from '../util/dom-loaded';

const { protocol, host } = location;

Leaflet.Icon.Default.imagePath = `${protocol}//${host}`;

Leaflet.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MAP_SELECTOR = '#photo-map';

const LEAFLET_CONTAINER_SELECTOR = '.leaflet-container';

const ACTION_CREATE = 'ACTION_CREATE';

const ACTION_RESOLVE_CREATE = 'ACTION_RESOLVE_CREATE';

const ACTION_DESTROY = 'ACTION_DESTROY';

const ACTION_RESOLVE_DESTROY = 'ACTION_RESOLVE_DESTROY';

const COMMAND_INIT = 'COMMAND_INIT';

const COMMAND_DESTROY = 'COMMAND_DESTROY';

const INITIAL_STATE = {
    command: null,
    elem: null,
    map: null,
};

const getBeforeVisit = () => Observable
    .fromEvent(document, 'turbolinks:before-visit');

const getElem = elemId => () =>
    Observable.of(document.querySelector(elemId));

const createAction = (type, payload) => ({ type, payload });

const reducer = (state, { type, payload }) => {
    const assign = merge(state);
    switch (type) {
    case ACTION_CREATE:
        return assign({
            command: COMMAND_INIT,
            elem: payload,
        });
    case ACTION_RESOLVE_CREATE:
        return {
            command: null,
            elem: null,
            map: payload,
        };
    case ACTION_DESTROY:
        return assign({
            command: COMMAND_DESTROY,
            elem: payload,
        });
    case ACTION_RESOLVE_DESTROY:
        return {
            command: null,
            elem: null,
            map: null,
        };
    default:
        return assign({});
    }
};

const addDispatcher = dispatcher$ => state => merge(state, {
    dispatch: (...args) => dispatcher$.next(createAction(...args)),
});

const hasElem = ({ elem }) => elem !== null;

const getCoords = (elem) => {
    const lat = elem.getAttribute('data-lat');
    const lng = elem.getAttribute('data-lng');
    if (!lat || !lng) {
        return null;
    }
    return [lat, lng];
};

const initializeMap = ({ elem, dispatch }) => {
    const coords = getCoords(elem);
    if (!coords) {
        return;
    }
    const container = document.createElement('div');
    elem.appendChild(container);
    const dragging = false;
    const map = Leaflet.map(container, { dragging }).setView(coords, 6);
    const maxZoom = 19;
    const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright" ' +
        'target="_blank">OpenStreetMap</a>';
    Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom, attribution }).addTo(map);
    Leaflet.marker(coords).addTo(map);
    dispatch(ACTION_RESOLVE_CREATE, map);
};

const removeMap = ({ elem, map, dispatch }) => {
    map.remove();
    elem.parentNode.removeChild(elem);
    dispatch(ACTION_RESOLVE_DESTROY);
};

const handleState = ({ command, ...state }) => {
    if (command === COMMAND_INIT) {
        initializeMap(state);
    }
    if (command === COMMAND_DESTROY) {
        removeMap(state);
    }
};

const main = () => {
    const dispatcher$ = new Subject();
    const domLoaded$ = getDomLoaded();
    const beforeVisit$ = getBeforeVisit();
    const initAction$ = domLoaded$
        .switchMap(getElem(MAP_SELECTOR))
        .filter(Boolean)
        .map(elem => createAction(ACTION_CREATE, elem));
    const destroyAction$ = beforeVisit$
        .switchMap(getElem(LEAFLET_CONTAINER_SELECTOR))
        .filter(Boolean)
        .map(elem => createAction(ACTION_DESTROY, elem));
    Observable
        .merge(initAction$, destroyAction$, dispatcher$)
        .scan(reducer, INITIAL_STATE)
        .distinctUntilKeyChanged('command')
        .filter(hasElem)
        .map(addDispatcher(dispatcher$))
        .subscribe(handleState);
};

export default main;
