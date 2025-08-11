import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import path from 'path';
require('@dotenvx/dotenvx').config({ path: path.resolve(__dirname, './test-data', 'login.env') })


export default defineConfig({
  use: {
    baseURL:  'https://restful-booker.herokuapp.com/'
  },
});



