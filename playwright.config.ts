import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import path from 'path';
delete process.env.username;
require('dotenv').config({ path: path.resolve(__dirname, './test-data', '.env.local') })

export default defineConfig({
  use: {
    baseURL:  'https://restful-booker.herokuapp.com/'
  },
});



