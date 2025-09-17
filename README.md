# Event Management System

A comprehensive event management system built with Laravel (PHP) backend and Next.js frontend, featuring timezone support, attendee registration, and real-time capacity management.

## 🚀 Features

### Backend (Laravel)
- **Event Management**: Create, read, update, and delete events
- **Timezone Support**: Full timezone conversion (IST to UTC and vice versa)
- **Attendee Registration**: Register attendees with duplicate email prevention
- **Capacity Management**: Prevent overbooking with real-time capacity checks
- **Pagination**: Efficient pagination for attendee lists
- **Validation**: Comprehensive input validation and error handling
- **Database**: PostgreSQL with proper relationships and constraints
- **Testing**: Complete unit test coverage (23 tests, 81 assertions)

### Frontend (Next.js + Shadcn UI)
- **Modern UI**: Beautiful, responsive interface with Shadcn UI components
- **Event Dashboard**: View all upcoming events with real-time data
- **Event Creation**: Intuitive form for creating new events
- **Attendee Management**: Register and manage attendees for each event
- **Real-time Updates**: Live capacity tracking and attendee counts
- **Timezone Support**: Create events in different timezones
- **Pagination**: Smooth pagination for large attendee lists

## 📋 API Endpoints

### Events
- `GET /api/events` - Get all upcoming events
- `POST /api/events` - Create a new event
- `GET /api/events/{id}` - Get a specific event
- `PUT /api/events/{id}` - Update an event
- `DELETE /api/events/{id}` - Delete an event

### Attendees
- `POST /api/events/{eventId}/register` - Register an attendee for an event
- `GET /api/events/{eventId}/attendees` - Get attendees for an event (with pagination)
- `GET /api/attendees/{id}` - Get a specific attendee
- `PUT /api/attendees/{id}` - Update an attendee
- `DELETE /api/attendees/{id}` - Delete an attendee

## 🛠️ Technology Stack

### Backend
- **PHP 8.4** with Laravel 12
- **PostgreSQL** database
- **Carbon** for timezone handling
- **Laravel Sanctum** for API authentication (ready for implementation)
- **PHPUnit** for testing

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **React Hook Form** with Zod validation
- **Axios** for API communication
- **Lucide React** for icons

## 📦 Installation & Setup

### Prerequisites
- PHP 8.4+
- Composer
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventManagement/backend
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

4. **Database configuration**
   Update `.env` file with your PostgreSQL credentials:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=event_management
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Start the server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd eventManagement/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
php artisan test
```

### Test Coverage
- **Event Management**: 9 tests covering CRUD operations, validation, and timezone handling
- **Attendee Management**: 12 tests covering registration, pagination, and duplicate prevention
- **Edge Cases**: Capacity limits, duplicate emails, validation errors

## 📊 Database Schema

### Events Table
```sql
- id (Primary Key)
- name (String, Required)
- location (String, Required)
- start_time (Timestamp, Required)
- end_time (Timestamp, Required)
- max_capacity (Integer, Required)
- description (Text, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Attendees Table
```sql
- id (Primary Key)
- event_id (Foreign Key → events.id)
- name (String, Required)
- email (String, Required)
- created_at (Timestamp)
- updated_at (Timestamp)
- UNIQUE(event_id, email) -- Prevents duplicate registrations
```

## 🌍 Timezone Support

The system supports multiple timezones with automatic conversion:

- **Default**: Asia/Kolkata (IST)
- **Supported**: UTC, EST, PST, GMT, CET, JST
- **Conversion**: All times stored in UTC, displayed in user's timezone
- **API**: Accept timezone parameter for accurate conversion

## 📝 API Examples

### Create Event
```bash
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2025",
    "location": "Convention Center, Mumbai",
    "start_time": "2025-12-15 09:00:00",
    "end_time": "2025-12-15 17:00:00",
    "max_capacity": 100,
    "description": "Annual technology conference",
    "timezone": "Asia/Kolkata"
  }'
```

### Register Attendee
```bash
curl -X POST http://localhost:8000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Get Event Attendees
```bash
curl -X GET "http://localhost:8000/api/events/1/attendees?page=1&per_page=10"
```

## 🎯 Key Features Implemented

### ✅ Core Requirements
- [x] Event CRUD operations
- [x] Attendee registration with validation
- [x] Capacity management (prevent overbooking)
- [x] Duplicate email prevention
- [x] Pagination for attendee lists
- [x] Timezone support (IST and others)

### ✅ Technical Requirements
- [x] Laravel with PostgreSQL
- [x] Clean architecture (MVC pattern)
- [x] Input validation and error handling
- [x] Separation of concerns
- [x] Unit tests (23 tests, 81 assertions)
- [x] Modern frontend with Next.js
- [x] Responsive UI with Shadcn components

### ✅ Bonus Features
- [x] Comprehensive unit testing
- [x] Timezone management
- [x] Pagination implementation
- [x] Modern UI/UX design
- [x] Real-time capacity tracking
- [x] Form validation with Zod
- [x] TypeScript for type safety

## 🚀 Getting Started

1. **Start the backend server** (Port 8000)
   ```bash
   cd backend && php artisan serve
   ```

2. **Start the frontend server** (Port 3000)
   ```bash
   cd frontend && npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - API Documentation: http://localhost:8000/api/documentation

## 📱 Screenshots

The application features:
- **Event Dashboard**: Clean grid layout showing all upcoming events
- **Event Creation**: Intuitive form with timezone selection
- **Attendee Management**: Table view with pagination and real-time updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🔧 Configuration

### Backend Configuration
- Database: PostgreSQL (configurable in `.env`)
- Timezone: Configurable per request
- Pagination: Default 15 items per page
- Validation: Comprehensive input validation

### Frontend Configuration
- API URL: Configurable in `.env.local`
- UI Theme: Dark/Light mode support
- Responsive: Mobile-first design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ using Laravel, Next.js, and modern web technologies.**
# events
