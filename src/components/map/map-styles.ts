import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';
import { LIGHT_BLUE } from '../../styles/variables';

export default StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: rem(500),
    border: '2px solid black',
    boxSizing: 'border-box',
    backgroundColor: LIGHT_BLUE,
  },
  empty: {
    height: '2px',
    visibility: 'hidden',
  },
  inner: {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    paddingTop: '50%',
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ':empty::before': {
      content: '"Loading map ..."',
      color: 'white',
      fontSize: rem(20),
    },
  },
});
