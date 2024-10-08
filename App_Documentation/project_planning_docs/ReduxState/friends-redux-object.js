const state = {
    friends: {
        byId: {
            2: {
                id: 2,
                firstName: "Clark",
                lastName: "Adams",
                username: "clark11",
                email: "clark@gmail.com"
            },
            3: {
                id: 3,
                firstName: "John",
                lastName: "Smith",
                email: "jsmith@gmail.com"
            },
            4: {
                id: 4,
                firstName: "Jane",
                lastName: "Doe",
                email: "janeDoe@gmail.com"
            }
        },
        allIds: [2, 3, 4]
    },
    friendRequests: {
        byId: {
            1: {
                friendId: 2,
                status: "pending"
            },
            2: {
                friendId: 2,
                status: "accepted"
            }
        },
        allIds: [1, 2]
    },
}
