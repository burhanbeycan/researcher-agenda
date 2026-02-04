# Changelog

All notable changes to ResearchHub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Calendar view for unified activity visualization
- Email reminder notifications system
- Advanced filtering by tags and date ranges
- Collaboration features for sharing manuscripts
- Export functionality (CSV, PDF, iCal)
- Mobile applications (iOS and Android)
- Analytics dashboard with research metrics
- Integration with academic databases

## [1.0.0] - 2026-02-04

### Added

#### Core Features
- **Manuscript Tracking System**
  - Create, read, update, and delete manuscripts
  - Track manuscript status (draft, submitted, under review, accepted, rejected, published)
  - Manage journal submissions and target dates
  - Detailed notes and progress tracking with timestamps
  - Full manuscript detail page with editable notes section

- **Conference Management**
  - Add and manage conference information
  - Track submission deadlines and attendance status
  - Store conference locations, dates, and website links
  - Attendance status tracking (interested, submitted, accepted, attended, rejected)
  - Comprehensive notes for each conference

- **Meeting Scheduler**
  - Schedule and organize research meetings
  - Track participants and meeting agendas
  - Set meeting duration and location
  - Add detailed notes and follow-up items
  - Search and filter meetings by date and participants

- **Dashboard Overview**
  - Real-time statistics on manuscripts, conferences, and meetings
  - Upcoming deadlines widget showing next 7 days
  - Quick stats summary for research activities
  - Welcome message with personalized greeting

- **Search & Organization**
  - Global search across all activity types
  - Filter by activity type and status
  - Tag-based organization system (database ready)
  - Responsive design for desktop and mobile devices

#### User Management
- OAuth-based authentication with Manus platform
- User profile management
- Session management with automatic logout
- Role-based access control (admin and user roles)
- Secure login page accessible to all users

#### Technical Features
- Type-safe API with tRPC
- Comprehensive database schema with 10 tables
- Drizzle ORM for database management
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- shadcn/ui components for consistent UI
- Responsive design for all screen sizes

#### Testing & Quality
- 18 passing unit tests covering:
  - Database CRUD operations
  - Authentication and logout
  - Data validation
- TypeScript type checking
- Code formatting with Prettier

#### Documentation
- Comprehensive README with setup instructions
- Contributing guidelines (CONTRIBUTING.md)
- MIT License
- Changelog (this file)
- Inline code documentation

### Technical Stack

**Frontend**
- React 19.2.1
- TypeScript 5.9.3
- Tailwind CSS 4.1.14
- shadcn/ui components
- Wouter 3.3.5 (routing)
- date-fns 4.1.0
- Sonner 2.0.7 (notifications)

**Backend**
- Express.js 4.21.2
- tRPC 11.6.0
- Drizzle ORM 0.44.5
- MySQL2 3.15.0
- JWT (jose 6.1.0)

**Development**
- Vite 7.1.7
- Vitest 2.1.4
- TypeScript 5.9.3
- Prettier 3.6.2
- pnpm 10.4.1

### Database Schema

Created comprehensive database schema with the following tables:

- `users` - User accounts and authentication
- `manuscripts` - Research manuscript records
- `conferences` - Conference and event information
- `meetings` - Meeting schedules and details
- `tags` - Custom tags for organization
- `manuscript_tags` - Manuscript-tag relationships
- `conference_tags` - Conference-tag relationships
- `meeting_tags` - Meeting-tag relationships
- `reminders` - Reminder configuration
- `reminder_logs` - Reminder send history

### API Procedures

Implemented tRPC procedures for:

**Manuscripts**
- `list` - Get user manuscripts with search
- `getById` - Get specific manuscript details
- `create` - Create new manuscript
- `update` - Update manuscript information
- `delete` - Delete manuscript

**Conferences**
- `list` - Get user conferences with search
- `getById` - Get specific conference details
- `create` - Create new conference
- `update` - Update conference information
- `delete` - Delete conference

**Meetings**
- `list` - Get user meetings with search
- `getById` - Get specific meeting details
- `create` - Create new meeting
- `update` - Update meeting information
- `delete` - Delete meeting

**Tags**
- `list` - Get user tags
- `create` - Create new tag
- `update` - Update tag
- `delete` - Delete tag

**Authentication**
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Pages & Routes

- `/` - Home/Landing page with login
- `/dashboard` - Main dashboard with overview
- `/manuscripts` - Manuscript list and management
- `/manuscript-detail` - Detailed manuscript view with notes
- `/conferences` - Conference list and management
- `/meetings` - Meeting list and management

### UI Components

- Dashboard layout with sidebar navigation
- Manuscript management interface
- Conference management interface
- Meeting scheduler interface
- Detail pages with full editing capabilities
- Search and filter interfaces
- Modal dialogs for creating/editing items
- Status badges and indicators
- Responsive cards and layouts

### Known Limitations

- Email reminder system requires external service integration
- Calendar view not yet implemented
- Tag management UI needs enhancement
- No collaboration features yet
- No export functionality

### Security

- OAuth-based authentication
- JWT session management
- Protected API procedures
- User-scoped data access
- Environment variable configuration for secrets

### Performance

- Optimized React rendering with proper memoization
- Efficient database queries
- Client-side search and filtering
- Responsive images and assets
- Lazy loading for routes

### Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance

---

## Future Versions

### v1.1.0 (Planned)
- Calendar view integration
- Email reminder system
- Advanced filtering UI
- Tag management interface
- Export to CSV/PDF

### v1.2.0 (Planned)
- Collaboration features
- Team workspaces
- Shared manuscripts
- Comments and discussions

### v2.0.0 (Planned)
- Mobile applications
- Real-time collaboration
- Advanced analytics
- API for third-party integrations

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last Updated:** February 4, 2026
