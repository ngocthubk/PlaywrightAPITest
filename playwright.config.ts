import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  use: {
    baseURL:  'https://restful-booker.herokuapp.com/'
  },
};
export default config;


