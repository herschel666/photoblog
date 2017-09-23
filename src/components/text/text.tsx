import * as React from 'react';

interface TextInterface {
  content: string;
  className?: string;
}

const Text: React.SFC<TextInterface> = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

export default Text;
