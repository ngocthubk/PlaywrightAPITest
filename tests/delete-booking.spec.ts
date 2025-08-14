import fs from 'fs';
import path from 'path';
import { request,test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { createToken } from '../helpers/token';
import { createBooking, deleteBooking, getBooking } from '../helpers/booking';
  

test.describe('Delete a booking', async () => {
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

    test(`DELETE Method - Delete a booking with the Id`, async ({ request }) => {
        let response 
        await test.step('1. Delete a booking',async()=>{
          response = await deleteBooking(request,tokenNumber,id)
                    
        }) 
        await test.step('2. Check the response',async()=>{ 
            await expect(await response.status()).toBe(201)            
            await expect(await response.text()).toContain('Created')         
        })  
        await test.step('3. Check if the booking is really deleted',async()=>{    
            let getRsp = await getBooking(request,id)
            await expect(getRsp.status()).toBe(404)
        })      
        
      });         

})