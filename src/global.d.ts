interface Navigator {
  canShare?: () => boolean;
  share?: (args: {}) => Promise<any>;
}
