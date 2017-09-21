import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';
import { BRIGHT, LIGHT_BLUE } from '../../styles/variables';

const linkHover = {
  color: LIGHT_BLUE,
};

export default StyleSheet.create({
  header: {
    paddingBottom: rem(16),
    marginBottom: rem(32),
    borderBottom: `${rem(10)} solid black`,
  },
  title: {
    fontsize: rem(24),
  },
  link: {
    textDecoration: 'none',
    color: BRIGHT,
    ':hover': linkHover,
    ':focus': linkHover,
  },
});
