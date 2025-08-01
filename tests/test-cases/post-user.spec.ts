import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';

var records;
records = parse(fs.readFileSync(path.join(__dirname, '../data/user.csv')), {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
});

for (var record of records) {
  test(`Create a new user ${record.username}`, async ({ request }) => {
    const newUser = await request.post(`user`, {
      data: {
      "id": record.id,
      "username": record.username,
      "firstName": record.firstName,
      "lastName": record.lastName,
      "email": record.email,
      "password": record.password,
      "phone": record.phone,
      "userStatus": record.userStatus
    }
  });
  
    const response = await newUser.json();

    console.log('body is '+ `${response.message}`);
    await expect(newUser.ok()).toBeTruthy();
    await expect(await newUser.json()).toEqual(expect.objectContaining({
    "message": ""+record.id+""
    }));
  
});
}