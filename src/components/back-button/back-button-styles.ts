import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';
import { BRIGHT } from '../../styles/variables';

const buttonHover = {
  opacity: 1,
  textDecoration: 'underline',
};

export default StyleSheet.create({
  wrap: {
    marginBottom: rem(16),
  },
  button: {
    position: 'relative',
    paddingLeft: rem(24),
    color: BRIGHT,
    fontSize: rem(16),
    opacity: 0.7,
    transition: 'opacity 250ms ease',
    textDecoration: 'none',
    ':hover': buttonHover,
    ':focus': buttonHover,
    '::before': {
      content: '"\u21B5"',
      position: 'absolute',
      left: 0,
      top: rem(2),
    },
  },
});
