import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';

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
    margin: `${rem(1)} 0 ${rem(2)} 0`,
  },
  aperture: {
    '::before': {
      content: '"ƒ"',
    },
  },
});
