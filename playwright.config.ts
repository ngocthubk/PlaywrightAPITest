import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
require('@dotenvx/dotenvx').config({ path: path.resolve(__dirname, './test-data', 'login.env') })
import path from 'path';

export default defineConfig({
  use: {
    baseURL:  'https://restful-booker.herokuapp.com/'
  },
});



