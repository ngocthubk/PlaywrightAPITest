import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { createBooking, deleteBooking, getBooking, updateBooking } from '../helpers/booking';
import { faker } from '@faker-js/faker';
  

test.describe('Update a booking', async () => {
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

    test(`PUT Method - Update a booking with the Id`, async ({ request }) => {
        let booking 
        let newFrstName 
        let newLstname
        let newPrice 
        let need

        await test.step('1. Update a booking',async()=>{
            newFrstName = faker.person.firstName();
            newLstname = faker.person.lastName()
            newPrice = faker.number.int()
            need = "Lunch"
          booking = await updateBooking(request,tokenNumber,id,{fName: newFrstName,lName:newLstname,price:newPrice,  addNeeds:need})
                    
        }) 
        await test.step('2. Check the response',async()=>{ 
                             
          await expect(booking).toHaveProperty("firstname", newFrstName);
          await expect(booking).toHaveProperty("lastname", newLstname);         
          await expect(booking).toHaveProperty("totalprice",newPrice);
          await expect(booking).toHaveProperty("additionalneeds",need);
          await expect(booking).toHaveProperty("bookingdates", {checkin: record.checkin,
                checkout: record.checkout});
          await expect(booking).toHaveProperty("depositpaid", JSON.parse(record.depositpaid));

        })        
        
      });
      
      // Teardown
    test.afterEach(async ({ request }) => {
      // Delete the booking
      await deleteBooking(request,tokenNumber,id)
    })

})