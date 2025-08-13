import { APIRequestContext } from '@playwright/test';

/* @Author: Thu Nguyen */
export async function createToken(request: APIRequestContext, username: string, password: string): Promise<string>{
    const tokenBody = { "username" : username,
    "password" : password}
    const newToken = await request.post(`auth`,{data: tokenBody});  
    let tokenJson = await newToken.json()  
    
    if(!newToken.ok())
          console.log("Cannot create a token");
    
    return tokenJson.token;
}