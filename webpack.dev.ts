// webpack.dev.ts
import { merge } from 'webpack-merge';
import common from './webpack.common.ts';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
});
