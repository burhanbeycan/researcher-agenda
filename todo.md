# Researcher Agenda Application - TODO

## Database & Backend
- [x] Design and implement database schema (manuscripts, conferences, meetings, tags, reminders)
- [x] Create database migration SQL
- [x] Implement database query helpers in server/db.ts
- [x] Create tRPC procedures for all CRUD operations

## UI Design & Layout
- [x] Design elegant color palette and typography system
- [x] Implement DashboardLayout with sidebar navigation
- [x] Create responsive design for mobile and desktop
- [x] Set up global styling and theme

## Manuscript Tracking
- [x] Create manuscript data model and database table
- [x] Implement add/edit/delete manuscript procedures
- [x] Build manuscript list view with status indicators
- [x] Build manuscript detail/edit modal
- [x] Add manuscript status tracking (draft, submitted, under review, accepted, rejected)

## Conference Management
- [x] Create conference data model and database table
- [x] Implement add/edit/delete conference procedures
- [x] Build conference list view with deadline indicators
- [x] Build conference detail/edit modal
- [x] Add attendance status tracking (interested, submitted, accepted, attended)

## Meeting Scheduler
- [x] Create meeting data model and database table
- [x] Implement add/edit/delete meeting procedures
- [x] Build meeting list view with date sorting
- [x] Build meeting detail/edit modal
- [x] Add participant tracking

## Calendar & Visualization
- [ ] Integrate calendar library (react-big-calendar or similar)
- [ ] Implement unified calendar view showing all activities
- [ ] Add event color coding by type (manuscript, conference, meeting)
- [ ] Implement calendar navigation and filtering

## Search & Filter
- [ ] Implement global search across all activity types
- [ ] Add filter by activity type (manuscript, conference, meeting)
- [ ] Add filter by status/date range
- [ ] Add tag-based filtering

## Tagging & Organization
- [ ] Create tag data model and database table
- [ ] Implement tag management (create, edit, delete)
- [ ] Add tag assignment to activities
- [ ] Build tag-based filtering UI

## Email Reminders & Notifications
- [ ] Set up email service integration
- [ ] Create reminder scheduling system
- [ ] Implement manuscript submission date reminders
- [ ] Implement conference deadline reminders
- [ ] Implement meeting time reminders
- [ ] Build reminder settings UI

## Testing & Quality
- [ ] Write vitest tests for database operations
- [ ] Write vitest tests for tRPC procedures
- [ ] Test all CRUD operations
- [ ] Test search and filter functionality
- [ ] Test calendar view rendering
- [ ] Test responsive design on mobile

## Deployment & Documentation
- [ ] Create checkpoint for deployment
- [ ] Prepare GitHub repository
- [ ] Document setup and usage instructions


## New Feature Requests

### Manuscript Detail Page
- [x] Create manuscript detail page component
- [x] Display full manuscript information
- [x] Implement editable notes section with add/delete functionality
- [x] Add ability to update manuscript from detail page
- [x] Link manuscripts list to detail page

### GitHub Integration & Documentation
- [x] Create README.md with setup instructions
- [x] Create .gitignore file
- [x] Create LICENSE file
- [x] Create CONTRIBUTING.md guidelines
- [x] Create CHANGELOG.md

### Login Page Improvements
- [x] Enhance public login page design
- [x] Make login page accessible to all users
- [x] Add authentication guard to protected routes
- [x] Redirect authenticated users to dashboard
- [x] Add logout functionality to all pages
