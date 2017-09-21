import * as React from 'react';

interface Props {
  content: string;
  className?: string;
}

const Text: React.SFC<Props> = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

export default Text;
