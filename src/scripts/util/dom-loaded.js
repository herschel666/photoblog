
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';

export default Observable
    .fromEvent(document, 'turbolinks:load')
    .startWith('turbolinks:load');
