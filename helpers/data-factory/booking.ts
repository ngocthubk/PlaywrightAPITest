import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import makeSynchronous from 'make-synchronous';

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

export async function getBookingData():Promise<any>{

    const client = new Client(dbConfig);
    var bookings;
    try {
        await client.connect();
        const result = await client.query("SELECT firstname,lastname,totalprice,depositpaid,checkin,checkout,additionalneeds from booking;")
        if (result.rows.length > 0){
            bookings = result.rows
        }else{
            console.log('No data found in the database.');
            throw new Error('No booking found in the query result.');
            bookings = [];
        }
    }finally{
        await client.end();
    }
    return bookings;

}

// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost', // Replace with your MySQL host
//     user: 'root', // Replace with your MySQL username
//     password: 'password', // Replace with your MySQL password
//     database: 'test', // Replace with your database name
//     port: 3306
// });

// export async function getBookingData():Promise<any>{
//     let bookingData: {firstname: string,lastname: string,totalprice:number,depositpaid:boolean,checkin:string,checkout:string,additionalneeds:string}[] 
// =   await connection.connect(async (err:any) => {
//         if (err) {
//             console.error('Error connecting to MySQL:', err);
//         return;
//         }
//         let x 
        
//         let temp =  await  connection.promise().query("SELECT firstname,lastname,totalprice,depositpaid,checkin,checkout,additionalneeds FROM booking")

//        return temp; 
//     });
//     console.log("bookingData is " + bookingData.length)
//     console.log(bookingData[0])
    
//     return bookingData[0];
// }
            
