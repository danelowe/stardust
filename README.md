# Stardust

A GitHub repository bookmark manager that solves two core problems for developers:

1. **Knowing which bookmarked repos are still worth using** (health monitoring)
2. **Discovering better alternatives as they emerge** (trending similar repos)

This transforms passive bookmarking into an active learning and discovery tool that keeps developers current with the
ecosystem.

## Getting Started

First, add GitHub personal access token to environment variable or .env

```
GITHUB_PAT=github_pat_...
```

Install dependencies, then migrate and seed the database.

```bash
pnpm install
pnpm migrate
pnpm seed
```

Run with

```bash
pnpm dev
```

## Code Structure

`/app`: Next.js application, including components and server action entrypoints.\
`/components/ui`: shadcn/ui generated components\
`/db`: Setting up Kysely connection, and generated types that represent our 'models'.\
`/domain`: Core of the backend. \
`/domain/[feature]/mutations`, `/domain/[feature]/queries`: Database interaction.
These get re-exported via `/domain/[feature]/store`.\
`/domain/[feature]/operations`: Service layer. Where backend processes are managed and glued together with database.\
`/lib`: Supporting code that will need to be rearranged as patterns emerge.\
`/scripts`: File that are run as `package.json` `scripts`. Run via `pnpm`.

## Features

To make the tool useful, it needs the hygiene factors to overcome friction,
but it also needs motivation factors to make it worthwhile to use. Create a retention loop.

Initial scaffold starts with the bare minimum on each of these.

### Hygiene Factors

- [x] Adding a repository should accept owner/repo or a URL.
- [ ] Optimistic UI updates for adding/removing repository.
- [ ] OAuth authentication with GitHub, both to log into the app, and to retrieve API tokens.
- [ ] The add a repository form should include a typeahead search for repositories.
- [ ] It should be possible to import user's stars.
- [ ] Markdown notes.
- [ ] Improve error states.

## Motivation Factors

- [x] Showing which repositories are stale or starting to slow in terms of contribution.
- [ ] Extend to showing a decent view of a repository's health (are issues piling up? are commits trending up/down?)
- [ ] Star trends for repositories and alternative repositories.
- [ ] Prompting to help find alternatives
- [ ] Using the user's note to help identify the best alternatives.
- [ ] License data. Users starting a new project based on a set of repositories might want to ensure compliance.

## Engineering Features

- [x] A pattern for client/server interaction and validation/sanitizing inputs.
- [x] Start with a demo user and their 'own' GitHub token
- [ ] Address TODOs to improve security posture (CSRF, pattern forming).
- [ ] Ensure error traces don't leak in production.
- [ ] Unit testing, integration testing, potentially E2E testing (Playwright) after code churn drops.
- [ ] Background tasks to update and monitor repository data.
- [ ] Integration with observability tooling. OpenTelemetry -> Tempo (add links to traces in development logs).
- [ ] CI setup
- [ ] Terraform/infrastructure setup
- [ ] Secrets management
- [ ] Linting to restrict imports between specific files.

## Architecture and Approach

**Tech Stack Choice: Next.js + Kysely + Tailwind + shadcn/ui + PGLite**

For most personal projects, I'd default to minimising dependencies.
Avoid frameworks, use plain CSS. Ensure its easy to pick up a year later. This takes time to scaffold,
and the tradeoffs for a quick iteration or product are very different.

### Next.js

I'd not used Next.js before, but was a chance to learn, and it seemed to be a good fit.

#### Reasons

- Consistency with existing technologies.
- Delays API layer creation until necessary (faster iteration)
- Server Components reduce client-side state complexity
- A well paved path for taking advantage of modern React.
- Strong LLM code generation support
- Large community = easier to find solutions

#### Tradeoffs

- Vercel lock-in concerns. Features optimized for their platform.
  - Mitigation: Keep service layer clean. Use standard React patterns. Allow for transition from Next.js
- AWS deployment complexity. Not a first-class target.
  - Mitigation: Deploy in container on ECS/Fargate.
- Learning curve (for me).
  - Clear service layer allows falling back to familiar patterns.
- Framework complexity. Could be simpler with Vite + React (except for API layer)
  - Mitigations: Minimise Next.js-specific feature usage, and lean into where it leverages modern React.
    Accept tradeoff for learning and alignment with company stack.

### Kysely

- Familiar - I know it will work with the access patterns in mind.
- Easy type-safety.
- Flexible
- postgres-first

#### Tradeoffs

- Boilerplate. More code than Prisma for siple CRUD.
  - Mitigation: Create lightweight repository pattern for CRUD. Use query builder directly for non-CRUD queries.
- Less LLM-friendly.
  - Mitigation: Lean into SQL-first approach, focus on using the database to its strengths.
    Consider that developer (not LLM) should remain intimately familiar with data access patterns.

> NOTE: Using ORM for mutations, and a separate query builder library for queries is a legitimate pattern.
> Although, UPDATE statements are relatively boilerplate-free for Kysely with generated `Insertable<T>` types.

### Tailwind

- Consistency with company stack.
- Prevents bikeshedding. Single pattern for use, and minimal scope to refactor.
- Design system in code. Constraints guide consistency
- LLM-Friendly
- Ugliness is a feature by signalling "this needs a component"

#### Tradeoffs

- HTML bloat
  - Mitigation: Extract components when necessary
- No separation of concerns
  - Mitigation: Mindful acceptance.
- Learning curve
  - Mitigation: Lean on IDE/LSP support.

### shadcn/ui

- As boring as possible. As close to wireframe as possible. Avoid tendency to tweak design until UI patterns emerge for MVP.
- Works with tailwind.
- LLM-Friendly
- Minimal overhead.

#### Tradeoffs

- Not a design system
  - Mitigation: Extract custom components as patterns emerge

### PGLite

- Zero setup.
- Can be leveraged for integration testing.
- Postgres compatibility.

> NOTE: Postgres would be a good fit for the feature set as envisaged in the near future (including PGVector, trigrams).
> Avoiding a database entirely was considered a potential sidestep rather than corner to cut.

#### Tradeoffs

- Not production ready
  - Mitigation: Use Postgres in production.
- No admin tools, limitations in features.
  - Run as a server, point Postgres to pgdata (if possible), or simply install and use Postgres for development.
    (PGLite is only being used to make demo easier to run here)

## Development philosophy

> **Wind-up mode.**
> In this mode, development philosophy is around minimising distraction, and focusing on quick delivery.

- Avoid refactoring until patterns emerge or are necessary. Let it become a pain point first.
- Good patterns lead to good practice. Put security in the pit of success.
  This is one area where early refactoring effort can pay off.
- Focus manual efforts on areas that have risk (security, complexity, tech-debt), and let LLM generate less risky code.
  Always read generated code line-by-line before committing, and remove redundant code
- Create patterns that ensure the right parts receive focus and are easy to get right.
  Remove boilerplate in important places and let LLM generate boilerplate in other places.

### On state management

Especially in MVP stage, client state should be minimised to help reduce complexity and adapt quicker.
Server components help here.

### On refactoring efforts

I like to ensure a pattern around form (or API request body) submission and sanitization,
as it’s important to work towards safe practices here.

Consistency is incredibly important in securing endpoints.
Clear patterns help to make it obvious where one is veering from the golden path, especially in code review.

### On design

The UI design is intentionally kept as minimal and boring as possible.
Avoiding spending any effort in colours, animation or polish.

Design can change as usage patterns emerge, so getting a working prototype up helps inform the design.

### On GitHub integration

Set up to use a token per user, pre-empting issues with rate limits,
and ensuring feature development keeps this limitation in mind.

Used Octokit library despite `fetch()` being a viable option as the project is based around GitHub.
The library is expected to help with OAuth and generating user tokens in the future.
