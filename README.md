# ParkEase - Smart Parking Management System

A modern parking management system built with Node.js, SQLite, and vanilla JavaScript.

## Features

- **User Management**: User registration, login, and profile management
- **Parking Locations**: Dynamic parking locations with real-time slot availability
- **Booking System**: Online parking booking with time slots and pricing
- **Database Integration**: SQLite database for persistent data storage
- **Responsive Design**: Modern UI with animated backgrounds and effects

## Database Schema

### Users Table
- `id` - Primary key
- `full_name` - User's full name
- `email` - Unique email address
- `phone` - Phone number
- `password` - Hashed password
- `created_at` - Account creation timestamp

### Parking Locations Table
- `id` - Primary key
- `name` - Location name
- `address` - Full address
- `total_slots` - Total number of parking slots
- `available_slots` - Currently available slots
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `created_at` - Location creation timestamp

### Bookings Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `location_id` - Foreign key to parking_locations table
- `booking_date` - Date of booking
- `start_time` - Booking start time
- `end_time` - Booking end time
- `duration` - Duration of booking
- `vehicle_number` - Vehicle registration number
- `vehicle_type` - Type of vehicle (car, bike, SUV)
- `phone_number` - Contact phone number
- `total_price` - Total booking amount
- `status` - Booking status (confirmed, cancelled)
- `created_at` - Booking creation timestamp

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## 🌐 Network Access (Access from Other Devices)

To access your ParkEase website from other devices on the same network:

### Quick Setup:
1. **Start the server** using `npm start` or `python run_website.py`
2. **Run the helper script** to get your IP address:
   ```bash
   python get_ip.py
   ```
3. **Share the IP address** with other devices on the same network
4. **Access the website** from their browser at: `http://YOUR_IP_ADDRESS:3000`

### Manual Method:
1. **Find your IP address**:
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network adapter
   - Example: `192.168.1.100`
   
2. **Start the server** (it's now configured for network access)

3. **Access from other devices**:
   - Open any browser on another device
   - Navigate to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

### Important Notes:
⚠️ **Security**: Only share within your local network (home/office Wi-Fi)  
⚠️ **Firewall**: If connection fails, allow Node.js through Windows Firewall  
⚠️ **Same Network**: Both devices must be on the same Wi-Fi/network  

### Troubleshooting:
- **Can't connect?** Check Windows Firewall settings
- **Connection refused?** Make sure the server is running
- **Wrong network?** Ensure devices are on the same Wi-Fi network

### Database Setup

The SQLite database will be automatically created when you first run the server. The database file will be created at `backend/db/parkease.db`.

Sample parking locations are automatically inserted:
- College Parking (40 total slots)
- DMart Tilakwadi (25 total slots)
- Nucleus Mall (20 total slots)
- INOX Cinema (25 total slots)

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile/:userId` - Update user profile

### Parking Locations
- `GET /api/locations` - Get all parking locations
- `GET /api/locations/:locationId` - Get specific location
- `POST /api/locations` - Add new location (admin)
- `PUT /api/locations/:locationId/slots` - Update slot availability

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `GET /api/bookings/:bookingId` - Get specific booking
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking

## Frontend Pages

1. **index.html** - Home page with search functionality
2. **signup.html** - User registration
3. **login.html** - User login
4. **parking location.html** - View all parking locations
5. **booking.html** - Make a parking booking
6. **profile.html** - User profile and booking history

## Usage

1. **Start the server** by running `npm start` in the backend directory
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Register a new account** or login with existing credentials
4. **Browse parking locations** and view real-time availability
5. **Make a booking** by selecting a location and filling the form
6. **View your bookings** in the profile section

## Features Implemented

✅ **SQLite Database Integration**
- Users table with authentication
- Parking locations with slot management
- Bookings with full CRUD operations

✅ **User Authentication**
- Secure password hashing with bcrypt
- JWT token-based authentication
- Session management

✅ **Real-time Slot Management**
- Dynamic slot availability updates
- Automatic slot reduction on booking
- Slot restoration on cancellation

✅ **Responsive Frontend**
- Modern UI with animated backgrounds
- Mobile-responsive design
- Interactive booking forms

✅ **API Integration**
- RESTful API endpoints
- Error handling and validation
- CORS support for frontend integration

## Technology Stack

- **Backend**: Node.js, Express.js, SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: SQLite
- **Authentication**: JWT, bcrypt
- **Styling**: Custom CSS with animations

## Project Structure

```
5th sem mini project/
├── backend/
│   ├── db/
│   │   ├── database.js
│   │   └── parkease.db (auto-generated)
│   ├── routes/
│   │   ├── users.js
│   │   ├── bookings.js
│   │   └── locations.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   ├── parking location.html
│   ├── booking.html
│   └── profile.html
└── README.md
```

## Future Enhancements

- Payment gateway integration
- Real-time notifications
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Email notifications
