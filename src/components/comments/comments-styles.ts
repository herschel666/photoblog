import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';
import { BLUE, LIGHT_BLUE } from '../../styles/variables';

const buttonHover = {
  backgroundColor: LIGHT_BLUE,
};

export default StyleSheet.create({
  comments: {
    paddingTop: rem(32),
    marginTop: rem(32),
    borderTop: '2px solid black',
  },
  button: {
    display: 'block',
    padding: `${rem(8)} ${rem(32)}`,
    margin: '0 auto',
    appearance: 'none',
    border: 'none',
    borderRadius: rem(32),
    backgroundColor: BLUE,
    color: 'white',
    fontSize: rem(20),
    cursor: 'pointer',
    transition: 'background 200ms linear',
    ':hover': buttonHover,
    ':focus': buttonHover,
  },
});
