

// don't forget that there is also a mockData file in the React UI project
//      shouldn't be a problem, but just keep in mind that there are two
//      sources of mock data...

// reference React app's features/processOrder.js

module.exports = {
    mockOrderData: {
        user_id: 4,
        cartInfo: 
            [
                {
                    "id": 1,
                    "quantity": 1,
                    "price": 1,
                    "item_total_price": 1.00,
                },
                {
                    "id": 2,
                    "quantity": 2,
                    "price": 2,
                    "item_total_price": 4.00,
                },
                {
                    "id": 3,
                    "quantity": 3,
                    "price": 3,
                    "item_total_price": 9.00,
                },
                {
                    "id": 4,
                    "quantity": 4,
                    "price": 4,
                    "item_total_price": 16.00,
                }
            ],
        totalPrice: 30.00,
        shippingInfo: {
            firstName: "testOrder_firstName",
            lastName: "testOrder_lastName",
            address1: "testOrder_address1",
            address2: "testOrder_address2",
            city: "testOrder_city",
            stateProvince: "testOrder_stateProvince",
            postalCode: "testOrder_postalCode",
            country: "testOrder_country"
        },
        paymentInfo: {
            charge: {
                id: 'ch_3KFE8HHtApZFXC0d1UUnmGqY',
                created: 1641545349,
                payment_method: 'card_1KFE8GHtApZFXC0dLz4kxOZV',
                receipt_url: 'https://pay.stripe.com/receipts/acct_1JbXRXHtApZFXC0d/ch_3KFE8HHtApZFXC0d1UUnmGqY/rcpt_Kv4GSnA1IqOMvSiL7YFwjeZc7YK42DW',
                status: 'succeeded',
            }
        }
    }
}
