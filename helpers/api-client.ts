import { PassThrough } from "node:stream";
import { APIRequestContext } from "playwright/test";


export class ApiClient{


private api: APIRequestContext;
private token: string = '';


constructor(api:APIRequestContext){
    this.api=api;
}




async authenticate():Promise<void>{

    const response = await this.api.post('https://restful-booker.herokuapp.com/auth',{
               data:{
                    'username':'admin',
                    'password':'password123'
                }})

            const body = await response.json();
            this.token= body.token;
            
}


 async createBooking(bookingData: object):Promise<{bookingid:number}>{


        const response = await this.api.post('https://restful-booker.herokuapp.com/booking',{

            headers: {
                
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                    },

                data:bookingData

 })

    const body = await response.json();

    return {

            bookingid:body.bookingid
    }




 }


  async getBooking(id:number):Promise<object | undefined>{

    const response = await this.api.get(`https://restful-booker.herokuapp.com/booking/${id}`,
        {
            headers:{

                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        }
    )

    if (!response.ok()) {
        return undefined;
    }

    return await response.json()
    

  }


  async deleteBooking(id:number):Promise<number>{

        const response = await this.api.delete(`https://restful-booker.herokuapp.com/booking/${id}`,
        {
            headers: { 'Cookie': `token=${this.token}` }
        }
        )

        console.log(response.headers)

        return response.status();

  }




}