import * as WebpackTypes from 'webpack';
import * as next from 'next';
import { getPathMap } from 'phox';

export const exportPathMap = async () => getPathMap();

export const webpack = (
  config: WebpackTypes.Configuration,
  { dev }: next.ServerOptions
) => {
  const { rules } = config.module as WebpackTypes.NewModule;
  config.module = {
    ...config.module,
    rules: rules.concat(
      {
        test: /\.css/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader'],
      }
    ),
  } as WebpackTypes.NewModule;
  return config;
};
