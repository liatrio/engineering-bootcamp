// webpack.prod.ts
import { merge } from 'webpack-merge';
import common from './webpack.common.ts';

export default merge(common, {
  mode: 'production',
});
