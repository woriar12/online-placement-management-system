# API Specifications & Endpoint Registry

All APIs are exposed under `/api` context path.

## Standard Response Format
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-08-13T15:30:00"
}
```

## Core Modules & Base Routes
- Auth: `/api/auth/*`
- Students: `/api/students/*`
- Companies: `/api/companies/*`
- Placement Drives: `/api/drives/*`
- Applications: `/api/applications/*`
- Admin: `/api/admin/*`
