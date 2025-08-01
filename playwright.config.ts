import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  use: {
    baseURL:  'https://petstore.swagger.io/v2/'
  },
};
export default config;


