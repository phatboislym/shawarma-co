# Shawarma Co

## Name

Shawarma Co

## Description

this is our webstack portfolio project for ALX SE specialization

Shawarma Co is a food delivery API with an optional frontend

## ROUTES

| Method | Route | Purpose |Access|
| ------- | :----- | :-------------: | ------------- |
| *POST* | ```/auth/register/``` | *Register new user*| *All users*|
| *POST* | ```/auth/login/``` | *Login user*|*All users*|
| *GET* | ```/auth/refresh/``` | *Refresh access token*|*All users*|
| *POST* | ```/auth/logout/``` | *Logout user*|*All users*|
| *GET* | ```/orders/``` | *List all orders made*|*Superuser*|
| *POST* | ```/orders/order``` | *Place an order*|*All users*|
| *PUT* | ```/orders/{order_id}/update/``` | *Update an order*|*All users*|
| *GET* | ```/orders/{order_id}/``` | *Retrieve an order*|*Superuser*|
| *PATCH* | ```/orders/{order_id}/status/``` | *Update order status*|*Superuser*|
| *DELETE* | ```/orders/{order_id}/delete/``` | *Delete an order* |*All users*|
| *GET* | ```/users/``` | *Get all users* |*Superuser*|
| *GET* | ```/users/{user_id}/``` | *Get a specific user* |*Superuser*|
| *GET* | ```/users/{user_id}/orders/``` | *Get user's orders*|*All users*|
| *GET* | ```/users/user/{order_id}/``` | *Get specific user's order*| *Superuser*
| *GET* | ```/docs/``` | *View API documentation*|*All users*|

## Authors

[Abdulrazaq Abdulazeez](https://github.com/aycrown77)

[Adewole Conde](https://github.com/phatboislym)

[Victor Opara](https://github.com/viktorzee)
