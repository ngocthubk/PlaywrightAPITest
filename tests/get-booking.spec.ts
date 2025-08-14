import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { createBooking, deleteBooking, getBooking } from '../helpers/booking';
  

test.describe('Get a booking', async () => {
    let id: number
    let records;

    // Read the test data from the csv file
    records = parse(fs.readFileSync(path.join(__dirname, '../test-data/booking.csv')), {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
    });
    let record = records![0];
    let tokenNumber: string;
    // Setup
    test.beforeEach(async ({ request }) => {
        
        let bkRsp = await createBooking(request,record.firstname,record.lastname,Number(record.totalprice),
          JSON.parse(record.depositpaid),record.checkin,record.checkout,record.additionalneeds) 
        id = bkRsp.bookingid        
        
        tokenNumber = await createToken(request, process.env.username!, process.env.password!)
    })

    test(`GET Method - Get a booking with the Id`, async ({ request }) => {
        let booking 
        await test.step('1. Get a booking',async()=>{
          booking = await getBooking(request,id)
                    
        }) 
        await test.step('2. Check the response',async()=>{                    
          await expect(booking).toHaveProperty("firstname", record.firstname);
          await expect(booking).toHaveProperty("lastname", record.lastname);
          await expect(booking).toHaveProperty("depositpaid", JSON.parse(record.depositpaid));
          await expect(booking).toHaveProperty("totalprice", Number(record.totalprice));
          await expect(booking).toHaveProperty("bookingdates", {checkin: record.checkin,
                    checkout: record.checkout});

        })        
        
      });
      
      // Teardown
    test.afterEach(async ({ request }) => {
      // Delete the booking
      await deleteBooking(request,tokenNumber,id)
    })

})