### Get all Payments for the by the Current User

Returns all the payments for the logged in user.

* Require Authentication: true
* Request
  * Method: GET
  * URL: /payments
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Component/Pages : Payments



### Create a Payement

* Require Authentication: true
* Request
  * Method: POST
  * URL: /payments/new
  * Body: CreateNewPaymentForm

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Component/Pages :Payments


### Create a Payement

* Require Authentication: true
* Request
  * Method: DELETE
  * URL: /payments/:paymentId
  * Body: DeletePayementModel

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Component/Pages : Payments


### Edit a Payment

* Require Authentication: true
* Request
  * Method: PUT
  * URL: /payments/:paymentId
  * Body: UpdatePayementForm

  * Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Component/Pages : Payments
