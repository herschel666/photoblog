import * as React from 'react';
import * as classnames from 'classnames';

interface TextInterface {
  content: string;
  className?: string;
}

const CSS_TRIGGER = 'main-content';

const Text: React.SFC<TextInterface> = ({ content, className }) => (
  <div
    className={classnames(className, CSS_TRIGGER)}
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default Text;
