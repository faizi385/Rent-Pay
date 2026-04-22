# RentPay - Peer-to-Peer Rental Marketplace for Pakistan

A modern, full-stack web application for renting items in Pakistan, built with Laravel 10 (backend) and React (frontend).

## Features

- **User Authentication**: Secure registration and login with Laravel Sanctum
- **Item Listings**: Create, browse, and search rental items
- **Categories**: Organize items by categories (Electronics, Clothing, Vehicles, etc.)
- **Booking System**: Request to rent items and manage booking requests
- **User Profiles**: View user profiles and their listings
- **Location-based**: Filter items by city
- **WhatsApp Integration**: Connect with item owners via WhatsApp
- **Admin Panel**: Basic admin functionality for managing users and listings
- **Responsive Design**: Mobile-first design using Tailwind CSS

## Tech Stack

### Backend
- **Laravel 10**: PHP framework
- **MySQL**: Database
- **Laravel Sanctum**: API authentication
- **RESTful API**: Clean API endpoints

### Frontend
- **React 18**: JavaScript library
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **Heroicons**: Icon library

## Installation

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- npm or yarn
- MySQL

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database**
   - Edit `.env` file with your database credentials
   - Create a database named `rentpay`

5. **Run migrations and seed data**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start the development server**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Default Users

After running the database seeder, you can use these test accounts:

### Admin User
- **Email**: admin@rentpay.com
- **Password**: password

### Test Users
- **Email**: ahmed@example.com
- **Password**: password

- **Email**: fatima@example.com
- **Password**: password

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `GET /api/categories/{id}` - Get category details
- `PUT /api/categories/{id}` - Update category (admin only)
- `DELETE /api/categories/{id}` - Delete category (admin only)

### Listings
- `GET /api/listings` - Get all listings (with search/filter)
- `POST /api/listings` - Create listing (authenticated)
- `GET /api/listings/{id}` - Get listing details
- `PUT /api/listings/{id}` - Update listing (owner only)
- `DELETE /api/listings/{id}` - Delete listing (owner only)
- `GET /api/my-listings` - Get current user's listings
- `POST /api/listings/{id}/images` - Upload listing images

### Booking Requests
- `GET /api/booking-requests` - Get booking requests
- `POST /api/booking-requests` - Create booking request
- `GET /api/booking-requests/{id}` - Get booking request details
- `PUT /api/booking-requests/{id}` - Update booking request status
- `DELETE /api/booking-requests/{id}` - Delete booking request

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/user` - Update current user profile
- `POST /api/user/profile-image` - Update profile image
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/{id}` - Delete user (admin only)

## Database Schema

### Users
- Basic user information with rental-specific fields
- Phone, city, bio, profile image, rating

### Categories
- Item categories (Electronics, Clothing, Vehicles, etc.)
- Name, description, slug, icon

### Listings
- Rental items with details
- Title, description, price, security deposit, location
- Relationships with users and categories

### Listing Images
- Multiple images per listing
- Sort order for image arrangement

### Booking Requests
- Rental requests with status tracking
- Start/end dates, messages, status (pending/accepted/rejected)

## Project Structure

```
RentPay/
|-- backend/
|   |-- app/
|   |   |-- Http/Controllers/Api/
|   |   |-- Models/
|   |-- database/
|   |   |-- migrations/
|   |   |-- seeders/
|   |-- routes/
|   |-- storage/
|   |-- .env
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- hooks/
|   |-- public/
|   |-- package.json
|
|-- README.md
```

## Features Implemented

### Completed
- [x] Laravel 10 backend setup
- [x] Database migrations and models
- [x] Laravel Sanctum authentication
- [x] API controllers and routes
- [x] React frontend with Vite
- [x] Tailwind CSS styling
- [x] Authentication system (login/register)
- [x] Navigation and routing
- [x] Home page with search
- [x] Listings browsing page
- [x] Category system
- [x] Seed data for testing

### In Progress
- [ ] Listing creation form
- [ ] Listing detail page
- [ ] Booking request system
- [ ] User profile management
- [ ] Image upload functionality
- [ ] WhatsApp integration
- [ ] Admin panel

### Future Enhancements
- [ ] Payment integration
- [ ] Rating and review system
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Mobile app
- [ ] Multi-language support

## Development Notes

- The backend API runs on port 8000
- The frontend runs on port 5173
- CORS is configured to allow cross-origin requests
- Images are stored in `public/storage`
- The app uses Pakistan-specific cities and categories
- All API endpoints are properly validated and error-handled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open-source and available under the MIT License.
# Rent-Pay
