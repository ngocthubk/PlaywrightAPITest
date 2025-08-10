import { APIRequestContext } from '@playwright/test';

export async function createToken(request: APIRequestContext, username: string, password: string): Promise<string>{
    const tokenBody = { "username" : username,
    "password" : password}
    const newToken = await request.post(`auth`,{data: tokenBody});
    const jsonResponse = await newToken.json();

    if(!newToken.ok())
          console.log("Cannot create a token");
        
    return jsonResponse.token;
}