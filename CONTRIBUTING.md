# Contributing to ResearchHub

Thank you for your interest in contributing to ResearchHub! We welcome contributions from the community. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- Git
- A MySQL or TiDB database for development

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork locally**
   ```bash
   git clone https://github.com/yourusername/researcher-agenda.git
   cd researcher-agenda
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/researcher-agenda.git
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

6. **Initialize database**
   ```bash
   pnpm db:push
   ```

7. **Start development server**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-calendar-view`
- `fix/manuscript-search-bug`
- `docs/update-readme`
- `test/add-conference-tests`

### Making Changes

1. **Write your code** following the existing style and conventions
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Format your code**
   ```bash
   pnpm format
   ```

5. **Check for TypeScript errors**
   ```bash
   pnpm check
   ```

### Testing

Before submitting a pull request, ensure all tests pass:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/crud.test.ts
```

### Committing Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add calendar view for activities"
```

Follow conventional commit format:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `style:` - Code style changes (formatting, etc.)
- `chore:` - Build process, dependencies, etc.

### Pushing and Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the changes
   - Description of what was changed and why
   - Reference to related issues (if any)
   - Screenshots for UI changes

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - be specific with types
- Use interfaces for object shapes
- Export types and interfaces for reuse

```typescript
// Good
interface Manuscript {
  id: number;
  title: string;
  status: ManuscriptStatus;
}

// Avoid
const manuscript: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components focused and single-responsibility
- Use TypeScript for prop types
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers passed as props

```typescript
// Good
interface ManuscriptCardProps {
  manuscript: Manuscript;
  onEdit: (id: number) => void;
}

export function ManuscriptCard({ manuscript, onEdit }: ManuscriptCardProps) {
  return (
    <Card onClick={() => onEdit(manuscript.id)}>
      {/* ... */}
    </Card>
  );
}
```

### Styling

- Use Tailwind CSS utilities
- Follow the existing color scheme
- Use semantic color names from CSS variables
- Keep responsive design in mind

```typescript
// Good
<div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
  {/* ... */}
</div>

// Avoid hardcoding colors
<div style={{ backgroundColor: '#f0f0f0' }}>
```

### Database

- Use Drizzle ORM for database operations
- Keep queries in `server/db.ts`
- Use transactions for multi-step operations
- Add proper error handling

```typescript
// Good
export async function createManuscript(userId: number, data: ManuscriptData) {
  try {
    const result = await db.insert(manuscripts).values({
      userId,
      ...data,
    });
    return result;
  } catch (error) {
    console.error("Failed to create manuscript:", error);
    throw error;
  }
}
```

## Documentation

### README Updates

If your changes affect how users interact with the application, update the README:
- Add new features to the Features section
- Update API documentation if procedures change
- Add new environment variables to the setup section

### Code Comments

Add comments for complex logic:

```typescript
// Calculate upcoming deadlines for the next 7 days
const upcomingDeadlines = activities.filter(activity => {
  const daysUntil = differenceInDays(activity.deadline, today);
  return daysUntil > 0 && daysUntil <= 7;
});
```

### Commit Messages

Write descriptive commit messages that explain the "why":

```
Good:
feat: add email reminder notifications
- Implement reminder scheduling system
- Add email service integration
- Create reminder settings UI

Bad:
update code
fix stuff
```

## Testing Guidelines

### Writing Tests

- Write tests for new features
- Test both happy path and error cases
- Use descriptive test names
- Keep tests focused and isolated

```typescript
describe("Manuscript CRUD", () => {
  it("should create a manuscript with valid data", async () => {
    const result = await createManuscript(userId, {
      title: "Test Manuscript",
      status: "draft",
    });
    expect(result.id).toBeDefined();
    expect(result.title).toBe("Test Manuscript");
  });

  it("should fail to create manuscript without title", async () => {
    expect(() => createManuscript(userId, { status: "draft" }))
      .toThrow();
  });
});
```

### Test Coverage

Aim for good coverage of:
- Database operations
- API procedures
- Complex business logic
- Error handling

## Submitting a Pull Request

### Before Submitting

- [ ] Tests pass: `pnpm test`
- [ ] Code is formatted: `pnpm format`
- [ ] No TypeScript errors: `pnpm check`
- [ ] Documentation is updated
- [ ] Commit messages are descriptive

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Code formatted
- [ ] Documentation updated
- [ ] No breaking changes
```

## Review Process

1. A maintainer will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged

## Reporting Bugs

### Before Reporting

- Check existing issues to avoid duplicates
- Verify the bug in the latest version
- Gather relevant information

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: (e.g., macOS 13.0)
- Node version: (e.g., 22.13.0)
- pnpm version: (e.g., 10.4.1)

## Screenshots
Attach screenshots if applicable

## Additional Context
Any other relevant information
```

## Feature Requests

### Submitting a Feature Request

```markdown
## Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you envision the feature working

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## Project Structure

Understanding the project structure helps with contributions:

```
researcher-agenda/
├── client/              # Frontend React app
│   ├── src/pages/      # Page components
│   ├── src/components/ # Reusable components
│   └── src/lib/        # Utilities
├── server/             # Backend Express server
│   ├── routers.ts      # tRPC procedures
│   └── db.ts           # Database helpers
├── drizzle/            # Database schema
└── shared/             # Shared types
```

## Common Tasks

### Adding a New Feature

1. Create database schema in `drizzle/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Add database helpers in `server/db.ts`
4. Add tRPC procedures in `server/routers.ts`
5. Create UI components in `client/src/pages/`
6. Add tests in `server/*.test.ts`
7. Update documentation

### Fixing a Bug

1. Create a test that reproduces the bug
2. Fix the bug in the code
3. Verify the test passes
4. Update documentation if needed

### Updating Documentation

1. Edit the relevant `.md` file
2. Keep formatting consistent
3. Add examples where helpful
4. Proofread before submitting

## Getting Help

- Check the [Issues](https://github.com/yourusername/researcher-agenda/issues) page
- Read the [README](README.md) and documentation
- Ask questions in pull request comments
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- The CONTRIBUTORS.md file
- Release notes for their contributions
- GitHub contributors page

## License

By contributing to ResearchHub, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue or discussion for any questions about contributing.

Thank you for contributing to ResearchHub! 🎉
