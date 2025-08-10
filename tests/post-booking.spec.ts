import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { Booking } from '../helpers/booking';

var records;
// const ids: Number[] = [];
let id:number
let tokenNumber: string;
records = parse(fs.readFileSync(path.join(__dirname, '../testData/booking.csv')), {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
});
let booking: Booking

test.beforeAll(async ({ request }) => {
    tokenNumber = await createToken(request, "admin","password123")     
})

for (var record of records) {
  test(`Create a booking ${record.firstname}  ${record.lastname}`, async ({ request }) => {

    await test.step('1. Create a booking with the POST method',async()=>{
      booking = await new Booking(record.firstname,record.lastname,Number(record.totalprice),
      JSON.parse(record.depositpaid),record.checkin,record.checkout,record.additionalneeds)
      let bkRes= await booking.createBooking(request)

      await expect(bkRes.booking).toHaveProperty("firstname", record.firstname);
      await expect(bkRes.booking).toHaveProperty("lastname", record.lastname);
      await expect(bkRes.booking).toHaveProperty("depositpaid", JSON.parse(record.depositpaid));
      await expect(bkRes.booking).toHaveProperty("totalprice", Number(record.totalprice));
      await expect(bkRes.booking).toHaveProperty("bookingdates", {checkin: record.checkin,
                checkout: record.checkout});
      // Store the id of a booking for cleaning up
      id =bkRes.bookingid
    }) 
       
});
}

test.afterEach(async ({ request }) => {
  // Delete the bookings
  await booking.deleteBooking(request,tokenNumber)
})
