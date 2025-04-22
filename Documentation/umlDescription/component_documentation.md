# RoomService Component Diagram Documentation #

## Overview ##
The `RoomService` is responsible for managing room listings in the system. It interacts with external services such as authentication and bidding systems, and handles validation, storage, and exposure of room listing data via REST APIs.

## Internal Components  

### 1. ListingManager `<component>`
- Handles all logic related to room listings (create, update, delete, retrieve).

### 2. ListingValidator `<component>`
- Validates room listing data

### 3. ListingRepository `<component>`
- Provides access to the MySQL database.


## Interfaces

### REST API `<interface>`
- Rest API serve as an Interface to allow components(micro services communicate with one another)

### AuthClient -> user_auth `<component>`
- Used to validate users or fetch user information.

### BidService `<component>/<microservice>`
- May be called to fetch or manage room biding.

### FeddbackService `<component>/<microservice>`
- May be called to manage feedback from clients.

### ContactService `<component>/<microservice>`
- May be called to manage communication between clients and landlord.

### SearchService `<component>/<microservice>`
- May be called to manage listings based on search filters
## Database

### MySQL `<database>`
- Stores all room listing data.
- Accessed via the `ListingRepository`.

### Redis `<database>`

- Redis stores frequently accessed data in memory, making it much faster to retrieve than from a database.

## Communication Flow 

- REST API → RoomService (ListingManager)
- ListingManager <--> ListingValidator, ListingRepository
- `Room service` <--> `MySQL`
- `Redis` <--> `MySql`
- `AuthClient` <--> `user_auth`
- (Optional) `RoomService` <--> `BidService`
- (Optional) `RoomService` <--> `SearchService`
- (Optional) `RoomService` <--> `feedbackService`
- (Optional) `RoomService` <--> `ContactService`


![component diagram](../images/component_diagram.png)

