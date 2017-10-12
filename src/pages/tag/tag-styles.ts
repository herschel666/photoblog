import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';

export default StyleSheet.create({
  heading: {
    marginBottom: rem(4),
  },
  pubdate: {
    display: 'block',
    fontSize: rem(12),
    marginBottom: rem(32),
  },
  description: {
    marginBottom: rem(32),
  },
});
