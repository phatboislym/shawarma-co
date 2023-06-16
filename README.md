
# Shawarma Co

## Name

Shawarma Co

## Description

this is our webstack portfolio project for ALX SE specialization

Shawarma Co is a food delivery API with an optional frontend

## ROUTES

| Method | Route | Purpose |Access|
| ------- | ----- | ------------- | ------------- |
| *POST* | ```/auth/signup/``` | *Register new user*| *All users*|
| *POST* | ```/auth/login/``` | *Login user*|*All users*|
| *POST* | ```/orders/order/``` | *Place an order*|*All users*|
| *PUT* | ```/orders/order/update/{order_id}/``` | *Update an order*|*All users*|
| *PUT* | ```/orders/order/status/{order_id}/``` | *Update order status*|*Superuser*|
| *DELETE* | ```/orders/order/delete/{order_id}/``` | *Delete/Remove an order* |*All users*|
| *GET* | ```/orders/user/orders/``` | *Get user's orders*|*All users*|
| *GET* | ```/orders/orders/``` | *List all orders made*|*Superuser*|
| *GET* | ```/orders/orders/{order_id}/``` | *Retrieve an order*|*Superuser*|
| *GET* | ```/orders/user/order/{order_id}/``` | *Get specific user's order*| *Superuser*
| *GET* | ```/docs/``` | *View API documentation*|*All users*|

## Authors

[Abdulrazaq Abdulazeez](https://github.com/aycrown77)

[Adewole Conde](https://github.com/phatboislym)

[Victor Opara](https://github.com/viktorzee)
