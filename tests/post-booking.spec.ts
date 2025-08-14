import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { createBooking, deleteBooking } from '../helpers/booking';

/* @Author: Thu Nguyen */

test.describe('Create a booking', async () => {
  let records;
  let tokenNumber: string;
  let id:number
  // Read the test data from the csv file
  records = parse(fs.readFileSync(path.join(__dirname, '../test-data/booking.csv')), {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  });

  // Setup
  test.beforeAll(async ({ request }) => {

    tokenNumber = await createToken(request, process.env.username!, process.env.password!)     
  })

  for (var record of records) {
    test(`POST Method - Create a booking ${record.firstname}  ${record.lastname}`, async ({ request }) => {
      let bkRes
      await test.step('1. Create a booking',async()=>{
        bkRes= await createBooking(request,record.firstname,record.lastname,Number(record.totalprice),
        JSON.parse(record.depositpaid),record.checkin,record.checkout,record.additionalneeds)      
      })
      await test.step('2. Check the response',async()=>{
      
        await expect(bkRes.booking).toHaveProperty("firstname", record.firstname);
        await expect(bkRes.booking).toHaveProperty("lastname", record.lastname);
        await expect(bkRes.booking).toHaveProperty("depositpaid", JSON.parse(record.depositpaid));
        await expect(bkRes.booking).toHaveProperty("totalprice", Number(record.totalprice));
        await expect(bkRes.booking).toHaveProperty("bookingdates", {checkin: record.checkin,
                checkout: record.checkout});
      
      })   
      id=bkRes.bookingid     
  });
}

// Teardown
  test.afterEach(async ({ request }) => {
    // Delete the booking
    await deleteBooking(request,tokenNumber,id)
  })
})
