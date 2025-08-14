import { APIRequestContext } from '@playwright/test';

/* @Author: Thu Nguyen */

/** Create a booking with the POST method  
* @param request The request of the type APIRequestContext
* @param firstname The firstname of the customer 
  @param lastname The lastname of the customer
  @param totalprice The total price 
  @param depositpaid The value shows if deposit is paid or not
  @param checkin The checkin date of the booking
  @param checkout The checkout date of the booking
  @param additionalneeds The additional needs
*/
export async function   createBooking(request: APIRequestContext,firstName:string,lastName:string, totalPrice: number, depositPaid: boolean, 
    checkIn: string, checkOut: string, additionalNeeds: string): Promise<any>{
        let body = {
              firstname: firstName,
              lastname: lastName,
              totalprice: totalPrice,
              depositpaid: depositPaid,
              bookingdates:{
                checkin: checkIn,
                checkout: checkOut
              },
              additionalneeds: additionalNeeds
            }
    
        const newBooking = await request.post(`booking`,{data: body});
        let bkJson= await newBooking.json();
        if(!newBooking.ok())
            console.log("Cannot create a booking");
        
        return bkJson
    };

/** Delete a booking with the DELETE method 
* @param request The request of the type APIRequestContext
* @param token Token for the permission required to delete a booking
* @param id The Id of the booking you want to get
*/  
export async function  deleteBooking(request: APIRequestContext,token: string,id: number): Promise<any>{
    let header = {"Content-Type": "application/json",
        Cookie: `token=${token}`}
        
    let response = await request.delete(`booking/`+String(id),{headers: header});
    // console.log("id in delete is " +id + " respone is " + await response.text())
    if(!response.ok())
        console.log("Cannot delete a booking");
    return response
}
/**
 * Get a booking with the GET method
 * @param request The request of the type APIRequestContext
 * @param id The Id of the booking you want to get
 */
export async function  getBooking(request: APIRequestContext,id: number): Promise<any>{
    let response = await request.get(`booking/` + String(id))
        
    if (response.ok())
        return await response.json();
    else
        return response

}

/**
 * Update a booking with the PUT method
  @param request The request of the type APIRequestContext
  @param token Token for the permission required to update a booking
  @param id The Id of the booking you want to get
  @param firstname The firstname of the customer 
  @param lastname The lastname of the customer
  @param totalprice The total price 
  @param depositpaid The value shows if deposit is paid or not
  @param checkin The checkin date of the booking
  @param checkout The checkout date of the booking
  @param additionalneeds The additional needs
 */
export async function  updateBooking(request: APIRequestContext,token: string,id: number, options?:{
    fName?: string,
    lName?: string,
    price?: number,
    deposit?: boolean,
    chin?: string,
    chout?: string,
    addNeeds?: string

}): Promise<any>{
    let oldBooking = await getBooking(request,id)
    let body = {
        firstname: options!.fName ? options!.fName:oldBooking.firstname,
        lastname: options!.lName ? options!.lName:oldBooking.lastname,
        totalprice: options!.price ? options!.price:oldBooking.totalprice,
        depositpaid: options!.deposit ? options!.deposit:oldBooking.depositpaid,
        bookingdates:{
        checkin: options!.chin ? options!.chin:oldBooking.bookingdates.checkin,
        checkout: options!.chout ? options!.chout:oldBooking.bookingdates.checkout
        },
        additionalneeds: options!.addNeeds ? options!.addNeeds:oldBooking.additionalneeds
        } 
       
    let header = {"Content-Type": "application/json",
    Cookie: `token=${token}`}
    let response = await request.put(`booking/` + String(id),{data: body, headers: header})
           
    if (response.ok())
        return await response.json();
    else
        return response

}

