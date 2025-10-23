import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { createBooking, deleteBooking } from '../helpers/booking';
import { getBookingData} from '../helpers/data-factory/booking'
import { format } from 'date-fns';

/* @Author: Thu Nguyen */


  // let records;
let records : {firstname: string,lastname: string,totalprice:number,depositpaid:boolean,checkin:string,checkout:string,additionalneeds:string}[]
let tokenNumber: string;
let id:number
// Read the test data from the csv file

test.describe('Create a booking', async () => {
  // Setup

  test.beforeAll(async ({ request }) => {
    records =  await getBookingData()
    tokenNumber = await createToken(request, process.env.username!, process.env.password!) 
      
  });


  // Skip the entire file if no users are found to prevent errors
// test.skip(!!records && records.length === 0, 'No users found in database');

[0,1,2,3].forEach((i)=>{
  test(`POST Method - Create a booking ${i}`, async ({ request}) => {
     let bkRes
     let record = records[i]
      await test.step('1. Create a booking',async()=>{
        bkRes= await createBooking(request,record.firstname,record.lastname,record.totalprice,
        record.depositpaid,format(record.checkin,"yyyy/MM/dd"),format(record.checkout,"yyyy/MM/dd"),record.additionalneeds)      
      })
      await test.step('2. Check the response',async()=>{
      
        await expect(bkRes.booking).toHaveProperty("firstname", record.firstname);
        await expect(bkRes.booking).toHaveProperty("lastname", record.lastname);
        await expect(bkRes.booking).toHaveProperty("depositpaid", Boolean(record.depositpaid));
        await expect(bkRes.booking).toHaveProperty("totalprice", Number(record.totalprice));
        await expect(bkRes.booking).toHaveProperty("bookingdates", {checkin: format(record.checkin,"yyyy-MM-dd"),
                checkout: format(record.checkout,"yyyy-MM-dd")});
      
      })   
      id=bkRes.bookingid     
  });
})


// Teardown
  test.afterEach(async ({ request }) => {
    // Delete the booking
    await deleteBooking(request,tokenNumber,id)
  })
})
