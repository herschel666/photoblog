import React from 'react';

import { PageContextProvider } from './page-context';

const Page: React.SFC = ({ children }) => (
  <PageContextProvider>{children}</PageContextProvider>
);

export default Page;
