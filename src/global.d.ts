interface Navigator {
  canShare?: () => boolean;
  share?: (args: unknown) => Promise<any>;
}
