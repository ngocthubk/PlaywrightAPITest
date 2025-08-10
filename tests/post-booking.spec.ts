import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';

var records;
const ids: Number[] = [];
let tokenNumber: string;
records = parse(fs.readFileSync(path.join(__dirname, '../testData/booking.csv')), {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
});

test.beforeAll(async ({ request }) => {
  // Create token 
    /* const tokenBody = { "username" : "admin",
    "password" : "password123"}
    const newToken = await request.post(`auth`,{data: tokenBody});
    const jsonResponse = await newToken.json();
    tokenNumber = jsonResponse.token; */
    tokenNumber = await createToken(request, "admin","password123")     
  
})

for (var record of records) {
  test(`Create a booking ${record.firstname}  ${record.lastname}`, async ({ request }) => {
    let body = {
      firstname: record.firstname,
      lastname: record.lastname,
      totalprice: Number(record.totalprice),
      depositpaid: JSON.parse(record.depositpaid),
      bookingdates:{
        checkin: record.checkin,
        checkout: record.checkout
      },
      additionalneeds: record.additionalneeds
    }

      const newBooking = await request.post(`booking`, {
      data: body     
      });
      let response = await newBooking.json();
 
      await expect(newBooking.ok()).toBeTruthy();
      await expect(response.booking).toEqual(expect.objectContaining(body));
      // Store the id of a booking for cleaning up
      ids.push(response.bookingid)
       
});
}

test.afterAll(async ({ request }) => {
  // Delete the bookings
  for (let id of ids) {
    let header = {Cookie: 'token='+ tokenNumber}
    const response = await request.delete(`booking/`+String(id),{headers: header});

    if(!response.ok())
      console.log("Cannot delete a booking");
  }
})
