type BookingResponse = {
    status: 'failure' | 'success',
    seats?: number[]
    error?: string
}

type Seat = {
    number: number,
    status: 'booked' | 'vacant'
}