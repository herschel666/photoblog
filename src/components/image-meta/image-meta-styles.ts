import { StyleSheet } from 'aphrodite';
import { LIGHT_BLUE, GREYISH } from '../../styles/variables';
import { rem } from '../../styles/functions';

const tagHoverFocus = {
  background: LIGHT_BLUE,
};

export default StyleSheet.create({
  hardware: {
    paddingLeft: rem(28),
    marginBottom: rem(18),
    fontSize: rem(18),
    background: 'url("/static/camera.svg") 0 45% no-repeat',
    backgroundSize: 'auto 95%',
  },
  list: {
    fontSize: rem(14),
  },
  type: {
    width: rem(110),
    marginBottom: rem(2),
    float: 'left',
    clear: 'left',
    fontWeight: 100,
    '::after': {
      content: '":"',
    },
  },
  definition: {
    margin: `${rem(1)} 0 ${rem(2)} ${rem(110)}`,
  },
  tags: {
    marginTop: rem(24),
  },
  tag: {
    display: 'inline-block',
    padding: `0 ${rem(8)}`,
    margin: `0 ${rem(8)} ${rem(8)} 0`,
    borderRadius: rem(4),
    background: GREYISH,
    color: '#222',
    textDecoration: 'none',
    userSelect: 'none',
    ':hover': tagHoverFocus,
    ':focus': tagHoverFocus,
  },
  aperture: {
    '::before': {
      content: '"ƒ"',
    },
  },
});
