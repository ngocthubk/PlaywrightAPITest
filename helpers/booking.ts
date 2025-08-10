import { APIRequestContext } from '@playwright/test';


export class Booking{

    private firstname
    private lastname
    private totalprice
    private depositpaid
    private checkin
    private checkout
    private additionalneeds
    private id

    constructor(firstname:string,lastname:string, totalprice: number, depositpaid: boolean, 
        checkin: string, checkout: string, additionalneeds: string){
            this.firstname = firstname
            this.lastname = lastname
            this.totalprice = totalprice
            this.depositpaid = depositpaid
            this.checkin = checkin
            this.checkout = checkout
            this.additionalneeds = additionalneeds

    }

    async  createBooking(request: APIRequestContext): Promise<any>{
        let body = {
              firstname: this.firstname,
              lastname: this.lastname,
              totalprice: this.totalprice,
              depositpaid: this.depositpaid,
              bookingdates:{
                checkin: this.checkin,
                checkout: this.checkout
              },
              additionalneeds: this.additionalneeds
            }
    
        const newBooking = await request.post(`booking`,{data: body});
        let bkJson= await newBooking.json();
        if(!newBooking.ok())
          console.log("Cannot create a booking");
        else
            this.id = bkJson.bookingid
        
        return bkJson
}
    async deleteBooking(request: APIRequestContext,token: string): Promise<any>{
        let header = {"Content-Type": "application/json",
            Cookie: `token=${token}`}
        const response = await request.delete(`booking/`+String(this.id),{headers: header});

        if(!response.ok())
        console.log("Cannot delete a booking");
        }
}

