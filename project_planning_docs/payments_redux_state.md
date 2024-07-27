# Payments Redux Store

```javascript

const paymentsReduxStore = {
  currPayment: {
    id: 1,
    payerId: {
      id: 1,
      username: "anurag",
      email: "email"
    },
    payeeId: {
      id: 1,
      username: "anurag",
      email: "email"
    },
    amount: 500,
    status: "pending",
    comments: [
      {
        id: 1,
        user: "anurag",
        userId: 3,
        expenseId: 5
      }
    ],
    createdAt: "2021-11-19 20:39:36",
    updatedAt: "2021-11-19 20:39:36"
  },
  allUserPayments: [
    {
      id: 1,
      payerId: {
        id: 1,
        username: "anurag",
        email: "email"
      },
      payeeId: {
        id: 1,
        username: "anurag",
        email: "email"
      },
      amount: 500,
      status: "pending",
      comments: [
        {
          id: 1,
          user: "anurag",
          userId: 3,
          expenseId: 5
        }
      ],
      createdAt: "2021-11-19 20:39:36",
      updatedAt: "2021-11-19 20:39:36"
    },
    {
      id: 2,
      payerId: {
        id: 3,
        username: "anurag",
        email: "email"
      },
      payeeId: {
        id: 4,
        username: "anurag",
        email: "email"
      },
      amount: 100,
      status: "complete",
      comments: [
        {
          id: 1,
          user: "anurag",
          userId: 3,
          expenseId: 5
        }
      ],
      createdAt: "2021-11-19 20:39:36",
      updatedAt: "2021-11-19 20:39:36"
    }
  ]
};
