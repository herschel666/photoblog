export interface View<T> {
  getInitialProps: () => Promise<T>;
}
