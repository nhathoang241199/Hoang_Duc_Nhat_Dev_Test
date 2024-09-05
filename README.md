# Video Sharing Application

## Introduction

This project is a video-sharing application that allows users to register, log in, share YouTube videos, and like or unlike videos shared by others. The application is built using modern web technologies, focusing on performance, scalability, and ease of use.

### Key Features:

- User registration and login.
- Posting YouTube video URLs.
- Viewing a list of shared videos.
- Liking or unliking videos.
- Responsive design, suitable for both desktop and mobile devices.
- Real-time notification when a user shares a video.

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher) or **yarn** (v1.x or higher)
- **PostgreSQL** (v13.x or higher)
- **Docker** (v20.x or higher) and **Docker Compose** (v1.27.x or higher) (for Docker deployment)
- **Git** (v2.x or higher)

## Installation & Configuration

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/video-sharing-app.git

   ```

2. **Install dependencies:**
   For back-end:

   cd back-end
   npm install

   For front-end:
   cd front-end
   npm install

3. **Environment Configuration:**
   For back-end:

   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=admin
   DB_PASSWORD=123456
   DB_NAME=video_share_db
   SECRET_KEY=secretKey

   For front-end:
   NEXT_PUBLIC_API_URL=http://localhost:3001

4. **Setup Database**

   1. Create the PostgreSQL database:
      psql -U your_username -c "CREATE DATABASE video_share_db;"

   2. Run Migrations:
      npm run migrate

      # or if using yarn

      yarn migrate

   3. Seed the Database:
      npm run seed
      # or if using yarn
      yarn seed

5. **Run the application**
   For back-end:

   npm run start:dev

   For front-end:

   npm run dev

   Then open your browser and navigate to http://localhost:3000.

   Run the test suite:

   npm test

6. **Docker deployment**
   docker-compose build
   docker-compose up --build
   Then open your browser and navigate to http://localhost:3000.

7. **Usage**
   Register/Login: Create an account or log in to an existing one.
   Share Video: Click on "Share video" and paste the YouTube URL to share.
   Like/Unlike Videos: Use the like/unlike buttons to vote on shared videos.

8. **Troubleshooting**
   Issue: Application won't start. Solution: Ensure all dependencies are installed and the .env file is correctly configured.

   Issue: Database connection errors. Solution: Verify that PostgreSQL is running and the database credentials in the .env file are correct.

   Issue: Docker container not starting. Solution: Check the Docker logs for any errors and ensure Docker is properly installed and running.
