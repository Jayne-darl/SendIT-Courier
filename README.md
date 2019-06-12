# SendIT-Courier
[![Build Status](https://travis-ci.org/Jayne-darl/SendIT-Courier.svg?branch=develop)](https://travis-ci.org/Jayne-darl/SendIT-Courier)
[![Coverage Status](https://coveralls.io/repos/github/Jayne-darl/SendIT-Courier/badge.svg?branch=develop)](https://coveralls.io/github/Jayne-darl/SendIT-Courier?branch=develop)
<a href="https://codeclimate.com/github/Jayne-darl/SendIT-Courier/maintainability"><img src="https://api.codeclimate.com/v1/badges/393f4378310a527b4d3a/maintainability" /></a>
<a href="https://codeclimate.com/github/Jayne-darl/SendIT-Courier/test_coverage"><img src="https://api.codeclimate.com/v1/badges/393f4378310a527b4d3a/test_coverage" /></a>
[![PyPI license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://github.com/Jayne-darl/SendIT-Courier/blob/develop/LICENSE)

## Features
* Users can create an account and login.
* Users can change the destination of a parcel delivery order.
* Users can cancel a parcel delivery order.
* Users can see the details of a delivery order.
* Admin can change the status and present location of a parcel delivery order.

## Other Features
* The application displays a Google Map with markers showing the pickup location and the destination.
* The application displays computed travel distance and journey duration between the pickup location abd the destination.
* The user gets real time email notification when Admin changes the status of the parcel.
* The user gets real time email notification when the Admin changes the present location of the parcel.

## Tools used in Project Creation
* HTML & CSS
* Node.js & Express.
* Eslint.
* Mocha, Chai & NYC for testing.
* Babel(To transpire down from ES6 to ES5).
* Travis CI, Coveralls, and Code climate.

## Requirements and Installation
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes

To install and run this project you would need to have installed:
* Git
* Node 

To run: 

``` 
$ git clone https://github.com/Jayne-darl/SendIT-Courier.git
$ cd SendIT-Courier
$ npm install
$ npm start 
```

 For Testing Purpose, run: 
 ``` 
 $ npm test
 ```

## HTTP Request Methods

These are the HTTP request methods used in this project.

| Method	| Action |
| --- | --- |
| `GET` |	This method is used to get a resource|
| `POST`	| This method is used to create a resource or send data |
| `PATCH`	| This method is used to update a resource |
| `DELETE`	| This method is used to delete a resource |

## HTTP Response Status Codes

These are the HTTP response codes used in this project.

| Status Codes | Indication |
| --- | --- |
| `200` |	This OK status code indicates that a request has succeeded |
| `201` |	This created status code indicates that a resource has been created |
| `400` |	This bad request error status code indicates that the request sent to the server is incorrect |
| `401` | The access credentials (via the Authorization header) were missing or are invalid |
| `403` | The credentials you provided are valid, but you are not authorized to access the resource you were looking for |
| `404` |	Returned when the request is valid, but the resource you try to access does not exist, or is outside your scope |
| `409` | This conflict status code indicates that the request--response asked for is conflicted |
| `500` |	This internal server error status code indicates that something has gone wrong on the web server |

## API Endpoints
| Endpoint |	Functionality |
| --- | --- |
| POST /api/v1/auth/create | Create a new account |
| POST /api/v1/auth/login | Log into account |
| POST /api/v1/parcels | Create a delivery order |
| GET /api/v1/parcels |	Fetch all parcel delivery order |
| GET /api/v1/parcels/:id	| Fetch a specific parcel order |
| PATCH /api/v1/parcels/:id/cancel |	Cancel a parcel delivery order |
| PATCH /api/v1/parcels/:id/update |	Update the current location and status of a delivery order |
| PATCH /api/v1/parcels/:id/destination |	Update the destination a delivery order |
| POST /api/v1/auth/mail | Send mail to users on delivery order update |


## Templater User Interface(UI)
https://jayne-darl.github.io/SendIT-Courier/UI/index.html

## Relevant Pivotal Tracker Stories
https://www.pivotaltracker.com/n/projects/2323020

## The API Endpints are hosted on heroku
https://sendit-heroku-staging.herokuapp.com

## The API Endpoints are documented on Apiary 
https://senditcourier.docs.apiary.io/

## Author
Jane U. Onwumere

## License
This is licensed for your use, modification and distribution under the [MIT license](https://opensource.org/licenses/MIT).
