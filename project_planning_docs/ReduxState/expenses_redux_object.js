const state = {
    Expenses: {
        1: {
            id: 1,
            ownerId: 1,
            description: "Description for expense id 1",
            amount: 100.00,
            settled: true,
            expenseShares: {
                1: {
                    id:1,
                    userId: 1,
                    amount: 33.33,
                    settled: true
                },
                2: {
                    id:2,
                    userId:2,
                    amount: 33.33,
                    settled: false
                },
                3: {
                    id:3,
                    userId:3,
                    amount: 33.34,
                    settled: false
                }
            }
        },
        2: {
            id: 2,
            ownerId: 1,
            description: "Description for expense id 2",
            amount: 100.00,
            settled: false,
            expenseShares: {
                1: {
                    id:1,
                    userId: 1,
                    amount: 33.33,
                    settled: true
                },
                2: {
                    id:2,
                    userId:2,
                    amount: 33.33,
                    settled: false
                },
                3: {
                    id:3,
                    userId:3,
                    amount: 33.34,
                    settled: false
                }
            }
        },
        3: {
            id: 3,
            ownerId: 1,
            description: "Description for expense id 3",
            amount: 100.00,
            settled: false,
            expenseShares: {
                1: {
                    id:1,
                    userId: 1,
                    amount: 33.33,
                    settled: true
                },
                2: {
                    id:2,
                    userId:2,
                    amount: 33.33,
                    settled: false
                },
                3: {
                    id:3,
                    userId:3,
                    amount: 33.34,
                    settled: false
                }
            }
        }
    }
}
