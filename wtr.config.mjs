import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9003,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            'pinkie-promise': `https://esm.sh/pinkie-promise@2.0.1`,
          },
        },
      },
    })
  ],
});
