import React from 'react';
import { navigate, Link as GatsbyLink, GatsbyLinkProps } from 'gatsby';
import { Helmet } from 'react-helmet';

import styles from './page-context.module.css';

interface PageContextProps {
  Link: React.SFC<GatsbyLinkProps<unknown>>;
}

const FallbackLink: React.SFC = ({ children }) => {
  console.warn(
    'Gatsby Page is not initialized, yet. Using fallback Link element.'
  );
  return <>{children}</>;
};
const PageContext = React.createContext<PageContextProps>({
  Link: FallbackLink,
});

const getBodyAttributes = (isTransitioning: boolean) => {
  const className = isTransitioning ? styles.body : '';

  return { className };
};

export const useLink = () => {
  const { Link } = React.useContext(PageContext);
  return Link;
};

export const PageContextProvider: React.SFC = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const Link: PageContextProps['Link'] = (props) => {
    const noop = () => void 0;
    const { children: linkChildren, onClick = noop, ref, ...linkProps } = props;
    const handleClick = (
      evnt: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      evnt.preventDefault();
      onClick({ ...evnt, preventDefault: noop });
      setIsTransitioning(true);
      // tslint:disable:next-line no-floating-promises
      navigate(props.to);
    };

    return (
      <GatsbyLink {...linkProps} onClick={handleClick}>
        {linkChildren}
      </GatsbyLink>
    );
  };

  React.useEffect(() => {
    if (isTransitioning) {
      setIsTransitioning(false);
    }
  });

  return (
    <PageContext.Provider value={{ Link }}>
      <>
        <Helmet bodyAttributes={getBodyAttributes(isTransitioning)} />
        {children}
      </>
    </PageContext.Provider>
  );
};
