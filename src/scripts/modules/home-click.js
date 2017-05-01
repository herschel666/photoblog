
import not from 'ramda/src/not';
import equals from 'ramda/src/equals';
import compose from 'ramda/src/compose';
import { visit } from 'turbolinks';
import getKeyDown, { KEY_LOWERCASE_H } from '../util/get-keydown';

const getSlash = () => '/';

const goHome = () => Array.of(location.pathname)
    .filter(compose(not, equals(getSlash())))
    .map(getSlash)
    .forEach(visit);

const main = () =>
    getKeyDown(KEY_LOWERCASE_H).subscribe(goHome);

export default main;
