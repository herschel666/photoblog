
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';

export default function getDomLoaded() {
    return Observable
        .fromEvent(document, 'turbolinks:load')
        .startWith('turbolinks:load')
        .debounceTime(500);
}
