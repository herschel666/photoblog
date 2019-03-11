import { StyleSheet, StyleDeclaration } from 'aphrodite';
import { rem } from '../../styles/functions';
import { GREYISH } from '../../styles/variables';

const hashLinkHover: StyleDeclaration = {
  textDecoration: 'none',
  '::before': {
    content: '"# "',
    position: 'absolute',
    top: rem(5),
    left: rem(-10),
    lineHeight: 1,
  },
};

export default StyleSheet.create({
  figure: {
    margin: `0 auto ${rem(40)} auto`,
  },
  imageWrap: {
    display: 'block',
    position: 'relative',
    height: 0,
    overflow: 'hidden',
  },
  image: {
    maxWidth: 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  figcaption: {
    display: 'flex',
  },
  detailFigcaption: {
    marginTop: rem(8),
    fontSize: rem(14),
  },
  hashLink: {
    position: 'relative',
    fontSize: rem(12),
    textDecoration: 'none',
    ':hover': hashLinkHover,
    ':focus': hashLinkHover,
  },
  time: {
    flex: '0 1',
    lineHeight: 1.9,
    fontSize: rem(12),
    color: GREYISH,
    verticalAlign: 'top',
  },
  needsDash: {
    '::after': {
      content: '"—"',
      display: 'inline',
      padding: `0 ${rem(12)}`,
      verticalAlign: 'top',
    },
  },
});
