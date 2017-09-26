import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';

export default StyleSheet.create({
  footer: {
    paddingTop: rem(24),
    marginTop: rem(32),
    borderTop: `${rem(4)} solid black`,
    fontSize: rem(12),
  },
  nav: {
    display: 'inline',
  },
});
