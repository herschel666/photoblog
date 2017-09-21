import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';

export default StyleSheet.create({
  main: {
    minHeight: `calc(100vh - ${rem(206)})`,
  },
  intro: {
    marginBottom: rem(32),
    fontSize: rem(24),
  },
});
