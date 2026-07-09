export const apiCredentials = {
    username: process.env.API_USERNAME ?? 'admin',
    password: process.env.API_PASSWORD ?? 'password123'
}

export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface Booking {
    firstname: string,
    lastname: string,
    totalprice: number,
    depositpaid: boolean,
    bookingdates: BookingDates,
    additionalneeds?: string
}
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
    return {
        firstname: 'Maria',
        lastname: 'Silva',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2025-01-10',
            checkout: '2025-01-15',
        },
        additionalneeds: 'Breakfast',
        ...overrides,
    };
}