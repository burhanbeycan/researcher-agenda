# ResearchHub - Academic Research Agenda Management

A comprehensive web application designed for university researchers to manage and organize their academic activities including manuscripts, conferences, and meetings in one elegant platform.

## Features

### Core Functionality

**Manuscript Tracking**
- Create, edit, and delete research manuscripts
- Track manuscript status (draft, submitted, under review, accepted, rejected, published)
- Manage journal submissions and target dates
- Add detailed notes and progress updates with timestamps
- View manuscript details with full editing capabilities

**Conference Management**
- Track conferences and academic events
- Monitor submission deadlines and attendance status
- Store conference locations, dates, and website links
- Manage attendance status (interested, submitted, accepted, attended, rejected)
- Keep comprehensive notes for each conference

**Meeting Scheduler**
- Schedule and organize research meetings
- Track participants and meeting agendas
- Set meeting duration and location
- Add detailed notes and follow-up items
- Search and filter meetings by date and participants

**Dashboard Overview**
- Real-time statistics on manuscripts, conferences, and meetings
- Upcoming deadlines widget showing next 7 days
- Quick stats summary for research activities
- Welcome message with user information

**Search & Organization**
- Global search across all activity types
- Filter by activity type, status, and date range
- Tag-based organization system
- Responsive design for desktop and mobile devices

### User Management

- Secure OAuth-based authentication
- User profile management
- Session management with automatic logout
- Role-based access control (admin and user roles)

## Technology Stack

**Frontend**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- shadcn/ui components for consistent UI
- Wouter for client-side routing
- date-fns for date manipulation
- Sonner for toast notifications

**Backend**
- Express.js for server framework
- tRPC for type-safe API procedures
- Drizzle ORM for database management
- MySQL/TiDB for data persistence
- JWT for session management

**Development**
- Vite for fast development and building
- Vitest for unit testing
- TypeScript for type safety
- ESLint and Prettier for code quality

## Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL or TiDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/researcher-agenda.git
   cd researcher-agenda
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/researcher_agenda
   JWT_SECRET=your-secret-key-here
   VITE_APP_ID=your-oauth-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://login.manus.im
   ```

4. **Initialize the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
researcher-agenda/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and helpers
│   │   ├── App.tsx        # Main app component
│   │   └── index.css      # Global styles
│   └── public/            # Static assets
├── server/                # Backend Express server
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database query helpers
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Drizzle ORM schema
├── shared/                # Shared types and constants
└── package.json           # Project dependencies
```

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **manuscripts** - Research manuscript records
- **conferences** - Conference and event information
- **meetings** - Meeting schedules and details
- **tags** - Custom tags for organization
- **manuscript_tags** - Manuscript-tag relationships
- **conference_tags** - Conference-tag relationships
- **meeting_tags** - Meeting-tag relationships
- **reminders** - Reminder configuration
- **reminder_logs** - Reminder send history

## Available Scripts

### Development
```bash
pnpm dev          # Start development server with hot reload
pnpm check        # TypeScript type checking
pnpm format       # Format code with Prettier
```

### Testing
```bash
pnpm test         # Run vitest tests
```

### Building
```bash
pnpm build        # Build for production
pnpm start        # Start production server
```

### Database
```bash
pnpm db:push      # Generate and apply database migrations
```

## Usage Guide

### Creating a Manuscript

1. Navigate to the **Manuscripts** section from the sidebar
2. Click the **New Manuscript** button
3. Fill in the manuscript details:
   - Title (required)
   - Status (draft, submitted, under review, etc.)
   - Journal name
   - Submission and target dates
4. Click **Create Manuscript**

### Viewing Manuscript Details

1. Click on any manuscript in the list to open the detail page
2. View all manuscript information in the details panel
3. Edit manuscript information by clicking **Edit Manuscript**
4. Add progress notes by typing in the note field and clicking **Add Note**
5. Delete all notes using the trash icon

### Managing Conferences

1. Go to the **Conferences** section
2. Create new conferences with dates, locations, and submission deadlines
3. Track your attendance status (interested, submitted, accepted, attended)
4. Search for conferences using the search bar
5. Edit or delete conferences as needed

### Scheduling Meetings

1. Navigate to **Meetings** section
2. Create meetings with:
   - Title and date/time
   - Duration and location
   - Participant names
   - Agenda and notes
3. Search meetings by title or participant names
4. Edit or delete meetings from the list

### Dashboard Overview

The dashboard provides:
- Total count of manuscripts, conferences, and meetings
- Breakdown by status (draft, submitted, etc.)
- Upcoming deadlines for the next 7 days
- Quick statistics for research activities

## Authentication

The application uses OAuth-based authentication through the Manus platform. Users must log in with their Manus credentials to access the application. The login page is publicly accessible, but all other pages require authentication.

### Login Flow

1. Visit the application home page
2. Click **Sign In** to redirect to the Manus login portal
3. Enter your credentials
4. You'll be redirected to the dashboard upon successful authentication
5. Use the **Logout** button to end your session

## API Documentation

The application uses tRPC for type-safe API calls. All procedures are defined in `server/routers.ts` and can be called from the frontend using the `trpc` client.

### Example API Calls

```typescript
// Get manuscripts
const manuscripts = await trpc.manuscripts.list.useQuery({ search: "query" });

// Create manuscript
await trpc.manuscripts.create.useMutation({
  title: "My Research",
  status: "draft",
  journal: "Nature",
});

// Update manuscript
await trpc.manuscripts.update.useMutation({
  id: 1,
  title: "Updated Title",
});

// Delete manuscript
await trpc.manuscripts.delete.useMutation({ id: 1 });
```

## Testing

The project includes comprehensive test coverage using Vitest:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/crud.test.ts
```

Current test coverage includes:
- Database CRUD operations (18 tests)
- Authentication and logout (1 test)
- Data validation tests

## Deployment

### Deploying to Manus

The application is built to deploy on the Manus platform:

1. Create a checkpoint in the Manus Management UI
2. Click the **Publish** button to deploy
3. Your application will be available at a unique Manus URL

### Deploying to Other Platforms

To deploy to external platforms (Vercel, Railway, Render, etc.):

1. Build the application:
   ```bash
   pnpm build
   ```

2. Set required environment variables on your hosting platform

3. Start the production server:
   ```bash
   pnpm start
   ```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit them (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Run `pnpm format` before committing

## Roadmap

### Upcoming Features

- **Calendar View** - Unified calendar displaying all activities with color-coded events
- **Email Reminders** - Automated email notifications for deadlines and meetings
- **Advanced Filtering** - Filter by tags, date ranges, and custom criteria
- **Collaboration** - Share manuscripts and meetings with collaborators
- **Export Functionality** - Export data to CSV, PDF, and iCal formats
- **Mobile App** - Native mobile applications for iOS and Android
- **Analytics Dashboard** - Research productivity metrics and insights
- **Integration** - Connect with academic databases and reference managers

## Known Issues

- Email reminder system requires external service integration
- Calendar view not yet implemented
- Tag management UI needs enhancement

## Support

For support, issues, or feature requests:

1. Check the [Issues](https://github.com/yourusername/researcher-agenda/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs
4. Provide screenshots or error messages when applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

**Burhan Beycan**
- GitHub: [@burhanbeycann](https://github.com/burhanbeycann)
- Email: burhanbeycan@gmail.com

## Acknowledgments

- Built with React, Express, and Drizzle ORM
- UI components from shadcn/ui
- Styling with Tailwind CSS
- Hosted on Manus platform

## Changelog

### Version 1.0.0 (2026-02-04)

**Initial Release**
- Manuscript tracking system with full CRUD operations
- Conference management with deadline tracking
- Meeting scheduler with participant management
- User authentication with OAuth
- Dashboard with activity overview
- Search functionality across all activity types
- Responsive design for desktop and mobile
- Comprehensive test coverage
- GitHub integration files

---

**Last Updated:** February 4, 2026

For the latest updates and information, visit the [GitHub repository](https://github.com/yourusername/researcher-agenda).
