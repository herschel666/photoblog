import React from 'react';
import classNames from 'classnames';

interface TextInterface {
  content?: string;
  className?: string;
}

const CSS_TRIGGER = 'main-content';

const Text: React.SFC<TextInterface> = ({ children, content, className }) => {
  const clsName = classNames(className, CSS_TRIGGER);

  if (children) {
    return <div className={clsName}>{children}</div>;
  }

  if (content) {
    return (
      <div className={clsName} dangerouslySetInnerHTML={{ __html: content }} />
    );
  }
  return null;
};

export default Text;
