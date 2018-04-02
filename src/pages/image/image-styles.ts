import * as React from 'react';
import { StyleSheet } from 'aphrodite';
import { rem } from '../../styles/functions';
import { MQ_MEDIUM } from '../../styles/variables';

const navItem = (additional: React.CSSProperties): React.CSSProperties => ({
  ...additional,
  width: '100%',
  maxWidth: '40%',
  paddingTop: rem(12),
  paddingBottom: rem(12),
  position: 'relative',
  fontSize: rem(12),
  userSelect: 'none',
  [`@media screen and (${MQ_MEDIUM})`]: {
    fontSize: rem(14),
  },
});

const navItemBeforeAfter = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
};

export default StyleSheet.create({
  heading: {
    marginBottom: rem(32),
  },
  nav: {
    marginTop: rem(-24),
    marginBottom: rem(24),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
  },
  prev: navItem({
    paddingLeft: rem(12),
    '::before': {
      ...navItemBeforeAfter,
      content: '"« "',
      left: 0,
    },
  }),
  next: navItem({
    paddingRight: rem(12),
    textAlign: 'right',
    '::after': {
      ...navItemBeforeAfter,
      content: '" »"',
      right: 0,
    },
  }),
  hidden: {
    visibility: 'hidden',
  },
  metaWrap: {
    paddingTop: rem(16),
    borderTop: '2px solid black',
    [`@media screen and (${MQ_MEDIUM})`]: {
      display: 'flex',
    },
  },
  map: {
    marginTop: rem(32),
    [`@media screen and (${MQ_MEDIUM})`]: {
      marginTop: 0,
    },
  },
  comments: {
    marginTop: rem(32),
    borderTop: '2px solid black',
  },
  meta: {
    [`@media screen and (${MQ_MEDIUM})`]: {
      flex: 1,
    },
  },
  camera: {
    [`@media screen and (${MQ_MEDIUM})`]: {
      marginRight: rem(16),
    },
  },
});
