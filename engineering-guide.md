# Hospital Management System Frontend Engineering Guide
## Purpose

This document defines the engineering standards and architecture for the Hospital Management System frontend.

These standards apply throughout the project unless explicitly overridden by an implementation prompt.

Feature-specific behavior should not be documented here. Each implementation prompt defines only the behavior of the feature being built.

The objective is to maintain a scalable, maintainable and production-ready frontend that integrates directly with the existing backend.

##Technology Stack

The frontend should use the following technologies unless explicitly instructed otherwise.

#### Core
React
JavaScript
Vite
#### Routing
React Router
#### Server State
TanStack Query
#### API Layer
Axios
#### Forms
React Hook Form
Zod
#### Styling
Tailwind CSS
shadcn/ui
#### Icons
Lucide React
#### Recommended Utilities

Use when appropriate.

Sonner
GSAP (only for subtle UI animations)

Avoid introducing additional libraries unless they provide significant value.

## Project Architecture

The project follows a feature-based architecture.

Each feature owns its own implementation.

A feature may contain only the folders it requires.

Examples:

api
pages
components
hooks
schemas
utils

Avoid creating unnecessary folders.

Promote code into shared modules only after genuine reuse becomes evident.

Avoid creating abstractions in anticipation of future reuse.

## Folder Structure

Organize the project around business features rather than technical layers.

Example:

src/

features/

components/

layouts/

providers/

routes/

store/

lib/

assets/

Each feature should remain independently evolvable.

Changes inside one feature should have minimal impact on unrelated features.

## Routing

Use React Router.

Keep routing centralized.

Feature pages remain inside their respective feature folders.

Layouts define the application shell.

Pages render feature-specific content inside layouts.

Avoid placing route protection logic inside individual pages.

## Data Layer

All asynchronous application data should be managed using TanStack Query.

Use:

Queries for fetching data.
Mutations for create, update and delete operations.

React components should never communicate directly with Axios.

Every interaction with backend data should pass through the feature's API layer.

Each feature owns its own queries, mutations and API implementation.

Invalidate affected queries after successful mutations where appropriate.

Use optimistic updates only when they improve user experience and remain maintainable.

## Frontend API Layer

Each feature should own its own API layer.

Examples:

authApi
appointmentApi
doctorApi
invoiceApi

The API layer represents frontend operations rather than backend endpoints.

React components and React Query hooks should communicate only with these API modules.

Keep backend communication isolated from presentation logic.

Backend Integration Rules

The backend already exists and is the source of truth.

Implement every feature using the provided backend API contracts.

Do not invent:

endpoints
request fields
response fields
business rules

Treat backend response structures as authoritative.

When an endpoint contains :id, replace it with the MongoDB _id of the resource currently being viewed or acted upon.

If backend behavior is unclear, ask rather than making assumptions.

## State Management

Choose the simplest solution appropriate for the problem.

Use:

TanStack Query

server state

React State

local component state

Redux Toolkit

authentication
current user
theme (if required)

Do not duplicate server state inside Redux.

## Forms & Validation

All forms should use:

React Hook Form
Zod

Validation should remain close to the feature that owns the form.

Prefer schema-based validation.

Disable invalid or duplicate submissions.

Display validation feedback clearly.

Successful mutations should update the interface naturally through React Query.

## Components

Components should have a single responsibility.

Prefer small composable components.

Separate presentation from data-fetching whenever practical.

Extract reusable UI only after genuine reuse becomes evident.

Feature-specific components remain inside their owning feature.

Shared components should remain generic and independent of business logic.

## Shared UI

Shared UI components should contain presentation logic only.

Examples include:

Button
Input
Dialog
Dropdown Menu
Avatar
Badge
Tabs
Tooltip
Skeleton
Spinner

Avoid placing feature-specific behavior inside shared components.

## Layouts

Layouts define the persistent application structure.

Layouts manage:

navigation
sidebar
header
application shell

Feature-specific business logic should not exist inside layouts.

## Styling

Use Tailwind CSS.

Use shadcn/ui as the primary component library.

The application should feel:

modern
professional
healthcare-oriented
minimal
information-focused

Use subtle animations only when they improve usability.

Avoid unnecessary visual complexity.

## Loading, Empty & Error States

Every asynchronous page should support:

loading
empty
error

Prefer skeletons over generic loading spinners where appropriate.

Provide meaningful recovery actions when requests fail.

Accessibility

Build accessible interfaces by default.

Use semantic HTML.

Associate labels with form controls.

Support keyboard navigation.

Ensure sufficient color contrast.

Interactive elements should expose visible focus states.

## Performance

Avoid unnecessary re-renders.

Split components as complexity grows.

Lazy load routes when appropriate.

Prioritize maintainability over premature optimization.

## Code Quality

Write readable and maintainable code.

Keep functions focused.

Avoid deeply nested logic.

Avoid duplication before introducing abstractions.

Prefer explicit code over clever code.

## Implementation Rules

Implement only the requested feature.

Reuse existing layouts, shared components and utilities whenever appropriate.

Create only the folders required by the feature.

Integrate directly with the provided backend APIs.

Follow the provided backend response contracts exactly.

Do not implement unrelated features.

Stop after the requested feature is complete.

## Backend-First Principle

The backend architecture has already been established.

Frontend implementations should adapt to the backend rather than redesigning backend contracts.

If a UI requirement appears incompatible with the existing backend, preserve the backend contract and implement the most appropriate frontend solution.

Do not propose backend changes unless they are necessary to support missing functionality or fix a genuine architectural issue.