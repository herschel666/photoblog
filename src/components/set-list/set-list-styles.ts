import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';

export default StyleSheet.create({
  list: {
    paddingLeft: 0,
    listStyle: 'none',
  },
  pubdate: {
    paddingRight: rem(16),
    fontSize: rem(12),
  },
  item: {
    margin: `${rem(16)} 0`,
  },
});
