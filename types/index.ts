export interface User{

        username:string,
        password:string


}

export type UserRoleType = 'standard' | 'admin' | 'locked' | 'frozen' | 'overdraft' | 'slow' | 'error';

export interface UserCredentials extends User {
    role: UserRoleType;
}


export interface BookingDates { 

    checkin:string,
    checkout:string

}

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

export interface BookingResponse {
    bookingid: number;
    booking: Booking;
}

export enum UserRole {
    Standard = 'standard_user',
    Admin = 'admin_user',
    Locked = 'locked_user',
    Frozen = 'frozen_user',
    Overdraft = 'overdraft_user',
    Slow = 'slow_user',
    Error = 'error_user',
}

export type OptionalBooking = Partial<Booking>;



export type PageName = 'login' | 'dashboard' | 'transfer' | 'admin';