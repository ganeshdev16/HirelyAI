# Hirely Job Portal - UML Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        ReactApp[React App]
    end

    subgraph "Next.js Application"
        Pages[Pages/Routes]
        Components[React Components]
        Context[Auth Context]
        API[API Routes]
    end

    subgraph "External Services"
        Firebase[Firebase Auth]
        FirebaseAdmin[Firebase Admin SDK]
        ReedAPI[Reed Job API]
    end

    subgraph "Data Layer"
        FirebaseDB[(Firebase Users)]
        ExternalJobs[(Reed Job Data)]
    end

    Browser --> ReactApp
    ReactApp --> Pages
    Pages --> Components
    Components --> Context
    Pages --> API
    API --> Firebase
    API --> FirebaseAdmin
    API --> ReedAPI
    Firebase --> FirebaseDB
    FirebaseAdmin --> FirebaseDB
    ReedAPI --> ExternalJobs
    Context --> Firebase
```

---

## Class Diagram - Core Models

```mermaid
classDiagram
    class User {
        +string uid
        +string email
        +string displayName
        +string photoURL
        +boolean emailVerified
        +string phoneNumber
        +string createdAt
        +string lastLoginAt
        +signIn(email, password)
        +signUp(email, password)
        +logout()
        +resetPassword(email)
        +sendVerificationEmail()
        +updateUserProfile(displayName, photoURL)
    }

    class Job {
        +number jobId
        +string jobTitle
        +number employerId
        +string employerName
        +string locationName
        +number minimumSalary
        +number maximumSalary
        +string currency
        +string date
        +string expirationDate
        +string jobDescription
        +string jobUrl
        +number applications
        +getJobDetails()
        +searchJobs(keywords, location)
        +applyToJob()
    }

    class AuthState {
        +User user
        +boolean isAuthenticated
        +boolean isLoading
        +boolean isEmailVerified
        +updateAuthState()
    }

    class SearchParams {
        +string keywords
        +string location
        +string category
        +number distanceFromLocation
        +number resultsToReturn
        +number resultsToSkip
        +buildQueryString()
    }

    class JobSearchResult {
        +Job[] jobs
        +number totalResults
        +number currentPage
        +number totalPages
        +filterResults()
        +sortResults()
    }

    User "1" -- "1" AuthState : contains
    Job "1..*" -- "1" JobSearchResult : contains
    SearchParams "1" -- "1" JobSearchResult : filters
```

---

## Component Hierarchy Diagram

```mermaid
graph TD
    RootLayout[RootLayout - AuthProvider]

    RootLayout --> NavBar[NavBar]
    RootLayout --> HomePage[HomePage]
    RootLayout --> SignUpPage[SignUpPage]
    RootLayout --> SignInPage[SignInPage]
    RootLayout --> SearchPage[SearchPage]
    RootLayout --> CategoryPage[CategoryPage]
    RootLayout --> JobDetailsPage[JobDetailsPage]
    RootLayout --> ContactPage[ContactPage]
    RootLayout --> AdminPage[AdminDashboard]
    RootLayout --> Footer[Footer]

    HomePage --> LogoStrip[LogoStrip]
    HomePage --> JobCategory[JobCategory]
    HomePage --> GoodLifeSection[GoodLifeCompanySection]
    HomePage --> Testimonials[TestimonialsSection]

    SearchPage --> JobSearchComponent[JobSearchComponent]
    CategoryPage --> JobBoard[JobBoard]

    SignUpPage --> CustomButton1[CustomButton]
    SignInPage --> CustomButton2[CustomButton]
    AdminPage --> CustomButton3[CustomButton]

    NavBar -.-> AuthContext[AuthContext Provider]
    SignUpPage -.-> AuthContext
    SignInPage -.-> AuthContext
    AdminPage -.-> AuthContext

    style AuthContext fill:#f9f,stroke:#333,stroke-width:2px
    style RootLayout fill:#bbf,stroke:#333,stroke-width:4px
```

---

## Sequence Diagram - User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant SignUpPage
    participant Firebase
    participant AuthContext
    participant NavBar
    participant EmailService

    User->>SignUpPage: Enter email & password
    SignUpPage->>Firebase: createUserWithEmailAndPassword()
    Firebase-->>SignUpPage: User created
    SignUpPage->>EmailService: Send verification email
    EmailService-->>User: Verification email sent
    SignUpPage->>SignUpPage: Show verification screen

    User->>User: Check email & click link
    User->>Firebase: Verify email
    Firebase-->>AuthContext: Update user state

    User->>SignInPage: Enter credentials
    SignInPage->>Firebase: signInWithEmailAndPassword()
    Firebase-->>SignInPage: Auth token
    SignInPage->>SignInPage: Check emailVerified

    alt Email Verified
        SignInPage->>AuthContext: Set authenticated user
        AuthContext->>NavBar: Update UI
        NavBar-->>User: Show authenticated state
    else Email Not Verified
        SignInPage-->>User: Show verification required
        SignInPage->>EmailService: Resend verification email
    end
```

---

## Sequence Diagram - Job Search Flow

```mermaid
sequenceDiagram
    actor User
    participant HomePage
    participant JobSearchComponent
    participant API
    participant ReedAPI
    participant JobDetailsPage

    User->>HomePage: Visit homepage
    HomePage->>User: Display categories

    User->>JobSearchComponent: Enter search (keywords, location)
    JobSearchComponent->>API: GET /api/jobs/search
    API->>API: Transform parameters
    API->>ReedAPI: GET /search?keywords=...
    ReedAPI-->>API: Job results (raw)
    API->>API: Transform response
    API-->>JobSearchComponent: Formatted jobs
    JobSearchComponent-->>User: Display results

    User->>JobSearchComponent: Click job
    JobSearchComponent->>JobDetailsPage: Navigate to /jobs/[jobId]
    JobDetailsPage->>API: GET /api/jobs/[jobId]
    API->>ReedAPI: GET /jobs/[jobId]
    ReedAPI-->>API: Job details
    API-->>JobDetailsPage: Job data
    JobDetailsPage-->>User: Show full details

    User->>JobDetailsPage: Click Apply
    JobDetailsPage->>ReedAPI: Redirect to external URL
```

---

## Sequence Diagram - Admin User Management

```mermaid
sequenceDiagram
    actor Admin
    participant AdminDashboard
    participant APIUsers
    participant FirebaseAdmin
    participant FirebaseDB

    Admin->>AdminDashboard: Access /admin/dashboard
    AdminDashboard->>APIUsers: GET /api/users
    APIUsers->>FirebaseAdmin: listUsers()
    FirebaseAdmin->>FirebaseDB: Query users
    FirebaseDB-->>FirebaseAdmin: User records
    FirebaseAdmin-->>APIUsers: User list
    APIUsers->>APIUsers: Calculate statistics
    APIUsers-->>AdminDashboard: UserListResponse
    AdminDashboard-->>Admin: Display users & stats

    alt Create User
        Admin->>AdminDashboard: Click Create User
        AdminDashboard->>APIUsers: POST /api/users
        APIUsers->>FirebaseAdmin: createUser()
        FirebaseAdmin->>FirebaseDB: Insert user
        FirebaseDB-->>FirebaseAdmin: Success
        FirebaseAdmin-->>APIUsers: User created
        APIUsers-->>AdminDashboard: Success response
        AdminDashboard->>AdminDashboard: Refresh user list
    else Delete User
        Admin->>AdminDashboard: Click Delete
        AdminDashboard->>APIUsers: DELETE /api/users/[uid]
        APIUsers->>FirebaseAdmin: deleteUser(uid)
        FirebaseAdmin->>FirebaseDB: Remove user
        FirebaseDB-->>FirebaseAdmin: Success
        FirebaseAdmin-->>APIUsers: User deleted
        APIUsers-->>AdminDashboard: Success response
        AdminDashboard->>AdminDashboard: Refresh user list
    end
```

---

## State Diagram - User Authentication States

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> SignUp : User signs up
    SignUp --> Unverified : Account created
    Unverified --> Unverified : Resend verification
    Unverified --> Verified : Email verified

    Unauthenticated --> SignIn : User signs in
    SignIn --> Unverified : Email not verified
    SignIn --> Authenticated : Email verified

    Authenticated --> Unauthenticated : Logout
    Verified --> SignIn : Sign in after verification

    state Authenticated {
        [*] --> Active
        Active --> PasswordReset : Request reset
        PasswordReset --> Active : Password updated
        Active --> ProfileUpdate : Update profile
        ProfileUpdate --> Active : Changes saved
    }
```

---

## Use Case Diagram

```mermaid
graph LR
    subgraph Actors
        JobSeeker[Job Seeker]
        Admin[Administrator]
        System[System/Cron]
    end

    subgraph "Job Seeker Use Cases"
        UC1[Sign Up]
        UC2[Sign In]
        UC3[Verify Email]
        UC4[Search Jobs]
        UC5[Browse Categories]
        UC6[View Job Details]
        UC7[Apply for Job]
        UC8[Reset Password]
        UC9[Update Profile]
    end

    subgraph "Admin Use Cases"
        UC10[View All Users]
        UC11[Create User]
        UC12[Delete User]
        UC13[View Statistics]
    end

    JobSeeker --> UC1
    JobSeeker --> UC2
    JobSeeker --> UC3
    JobSeeker --> UC4
    JobSeeker --> UC5
    JobSeeker --> UC6
    JobSeeker --> UC7
    JobSeeker --> UC8
    JobSeeker --> UC9

    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13

    UC2 -.includes.-> UC3
    UC6 -.includes.-> UC7
    UC1 -.includes.-> UC3
```

---

## Entity Relationship Diagram (Firebase Collections)

```mermaid
erDiagram
    USER {
        string uid PK
        string email
        string displayName
        string photoURL
        boolean emailVerified
        string phoneNumber
        timestamp createdAt
        timestamp lastLoginAt
    }

    JOB_EXTERNAL {
        number jobId PK
        string jobTitle
        number employerId FK
        string employerName
        string locationName
        number minimumSalary
        number maximumSalary
        string currency
        date date
        date expirationDate
        text jobDescription
        string jobUrl
        number applications
    }

    EMPLOYER {
        number employerId PK
        string employerName
        string location
    }

    JOB_EXTERNAL }o--|| EMPLOYER : "posted by"
```

**Note:** The project currently does NOT store job data locally. Jobs are fetched from Reed API in real-time. The diagram shows the logical structure of external data.

---

## API Routes Architecture

```mermaid
graph TB
    subgraph "Client Requests"
        Browser[Browser/Frontend]
    end

    subgraph "Next.js API Routes"
        JobsRoute["/api/jobs - GET"]
        JobDetailsRoute["/api/jobs/[jobId] - GET"]
        JobSearchRoute["/api/jobs/search - GET"]
        UsersListRoute["/api/users - GET"]
        UsersCreateRoute["/api/users - POST"]
        UsersDeleteRoute["/api/users/[uid] - DELETE"]
    end

    subgraph "External Services"
        ReedAPI[Reed Job Board API]
        FirebaseAdmin[Firebase Admin SDK]
    end

    subgraph "Responses"
        JobsResponse[Jobs Array]
        JobDetailsResponse[Job Object]
        UsersResponse[Users List + Stats]
        SuccessResponse[Success/Error]
    end

    Browser --> JobsRoute
    Browser --> JobDetailsRoute
    Browser --> JobSearchRoute
    Browser --> UsersListRoute
    Browser --> UsersCreateRoute
    Browser --> UsersDeleteRoute

    JobsRoute --> ReedAPI
    JobDetailsRoute --> ReedAPI
    JobSearchRoute --> ReedAPI

    UsersListRoute --> FirebaseAdmin
    UsersCreateRoute --> FirebaseAdmin
    UsersDeleteRoute --> FirebaseAdmin

    ReedAPI --> JobsResponse
    ReedAPI --> JobDetailsResponse
    FirebaseAdmin --> UsersResponse
    FirebaseAdmin --> SuccessResponse

    JobsResponse --> Browser
    JobDetailsResponse --> Browser
    UsersResponse --> Browser
    SuccessResponse --> Browser
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Client Side"
        Browser[User Browser]
        ReactComponents[React Components]
    end

    subgraph "Vercel/Next.js Hosting"
        NextServer[Next.js Server]
        APIRoutes[API Routes]
        SSR[Server-Side Rendering]
        StaticAssets[Static Assets]
    end

    subgraph "Firebase Services"
        FirebaseAuth[Firebase Authentication]
        FirebaseDB[(Firebase Users DB)]
    end

    subgraph "External APIs"
        ReedJobAPI[Reed Job Board API]
    end

    subgraph "Environment Variables"
        EnvVars[.env.local]
        FirebaseCreds[Firebase Service Account]
        ReedAPIKey[Reed API Key]
    end

    Browser --> NextServer
    NextServer --> ReactComponents
    NextServer --> SSR
    NextServer --> StaticAssets
    NextServer --> APIRoutes

    APIRoutes --> FirebaseAuth
    APIRoutes --> FirebaseDB
    APIRoutes --> ReedJobAPI

    EnvVars --> NextServer
    FirebaseCreds --> APIRoutes
    ReedAPIKey --> APIRoutes
```

---

## Data Flow Diagram - Complete System

```mermaid
flowchart TD
    Start([User Opens App])

    Start --> CheckAuth{User Authenticated?}

    CheckAuth -->|No| ShowPublic[Show Public Pages]
    CheckAuth -->|Yes| ShowAuth[Show Authenticated Pages]

    ShowPublic --> Actions1{User Action}
    ShowAuth --> Actions2{User Action}

    Actions1 -->|Sign Up| SignUpFlow[Sign Up Flow]
    Actions1 -->|Sign In| SignInFlow[Sign In Flow]
    Actions1 -->|Browse Jobs| JobSearch[Job Search]
    Actions1 -->|View Categories| Categories[Category Browse]

    Actions2 -->|Search Jobs| JobSearch
    Actions2 -->|View Profile| Profile[Profile Management]
    Actions2 -->|Logout| Logout[Logout Flow]
    Actions2 -->|Admin Access| AdminCheck{Is Admin?}

    AdminCheck -->|Yes| AdminDashboard[Admin Dashboard]
    AdminCheck -->|No| AccessDenied[Access Denied]

    SignUpFlow --> FirebaseCreate[Create Firebase Account]
    FirebaseCreate --> SendEmail[Send Verification Email]
    SendEmail --> EmailVerify[Wait for Verification]
    EmailVerify --> SignInFlow

    SignInFlow --> FirebaseAuth[Firebase Auth Check]
    FirebaseAuth --> VerifyCheck{Email Verified?}
    VerifyCheck -->|Yes| SetAuthState[Set Auth State]
    VerifyCheck -->|No| ResendEmail[Resend Verification]

    SetAuthState --> ShowAuth

    JobSearch --> APICall1[Call /api/jobs/search]
    Categories --> APICall2[Call /api/jobs]

    APICall1 --> ReedAPI[Query Reed API]
    APICall2 --> ReedAPI

    ReedAPI --> TransformData[Transform Response]
    TransformData --> DisplayJobs[Display Job Results]

    DisplayJobs --> JobClick{User Clicks Job?}
    JobClick -->|Yes| JobDetails[Fetch Job Details]
    JobClick -->|No| DisplayJobs

    JobDetails --> ShowDetails[Show Full Details]
    ShowDetails --> ApplyAction{User Applies?}
    ApplyAction -->|Yes| ExternalRedirect[Redirect to Reed URL]

    AdminDashboard --> FetchUsers[Fetch Users List]
    FetchUsers --> AdminActions{Admin Action}

    AdminActions -->|Create User| CreateUserAPI[POST /api/users]
    AdminActions -->|Delete User| DeleteUserAPI[DELETE /api/users/uid]
    AdminActions -->|View Stats| ShowStats[Display Statistics]

    CreateUserAPI --> FirebaseAdmin1[Firebase Admin Create]
    DeleteUserAPI --> FirebaseAdmin2[Firebase Admin Delete]

    FirebaseAdmin1 --> RefreshUsers[Refresh User List]
    FirebaseAdmin2 --> RefreshUsers
    RefreshUsers --> AdminDashboard

    Logout --> ClearState[Clear Auth State]
    ClearState --> ShowPublic
```

---

## Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        React[React 19]
        Next[Next.js 15.5.2]
        TS[TypeScript 5.x]
        Tailwind[Tailwind CSS 4.x]
        Lucide[Lucide Icons]
    end

    subgraph "State Management"
        Context[React Context API]
        Hooks[Custom Hooks]
    end

    subgraph "Backend Layer"
        APIRoutes[Next.js API Routes]
        ServerActions[Server Components]
    end

    subgraph "Authentication"
        FirebaseSDK[Firebase SDK 12.2.1]
        FirebaseAdminSDK[Firebase Admin 13.6.0]
    end

    subgraph "External Integration"
        ReedAPI[Reed Job Board API]
        Axios[Axios HTTP Client]
    end

    subgraph "Validation & Utilities"
        Zod[Zod Schema Validation]
    end

    subgraph "Development Tools"
        ESLint[ESLint]
        PostCSS[PostCSS]
    end

    React --> Next
    Next --> TS
    Next --> Tailwind
    React --> Lucide
    React --> Context
    Context --> Hooks

    Next --> APIRoutes
    Next --> ServerActions

    APIRoutes --> FirebaseAdminSDK
    Context --> FirebaseSDK

    APIRoutes --> Axios
    Axios --> ReedAPI

    APIRoutes --> Zod

    style Next fill:#0070f3,color:#fff
    style FirebaseSDK fill:#ffca28,color:#000
    style ReedAPI fill:#00b8a9,color:#fff
```

---

## Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        HTTPS[HTTPS Only]
        ClientValidation[Form Validation]
        CSP[Content Security Policy]
    end

    subgraph "Authentication Security"
        FirebaseAuth[Firebase Auth]
        EmailVerification[Email Verification]
        PasswordPolicy[Password Requirements]
        SessionManagement[Token-Based Sessions]
    end

    subgraph "API Security"
        CORS[CORS Configuration]
        RateLimiting[Rate Limiting - TBD]
        InputValidation[Zod Validation]
        AuthCheck[Auth Middleware - TBD]
    end

    subgraph "Server Security"
        EnvVars[Environment Variables]
        AdminSDK[Firebase Admin Private Key]
        APIKeys[External API Keys]
    end

    subgraph "Data Security"
        EncryptedStorage[Firebase Encrypted Storage]
        NoPlaintext[No Password Storage]
        SecureTokens[JWT Tokens]
    end

    HTTPS --> ClientValidation
    ClientValidation --> FirebaseAuth
    FirebaseAuth --> EmailVerification
    FirebaseAuth --> PasswordPolicy
    FirebaseAuth --> SessionManagement

    SessionManagement --> CORS
    CORS --> InputValidation
    InputValidation --> AuthCheck

    AuthCheck --> EnvVars
    EnvVars --> AdminSDK
    EnvVars --> APIKeys

    FirebaseAuth --> EncryptedStorage
    EncryptedStorage --> NoPlaintext
    NoPlaintext --> SecureTokens

    style FirebaseAuth fill:#f44336,color:#fff
    style EnvVars fill:#ff9800,color:#fff
```

---

## Future Enhancements - Planned Architecture

```mermaid
graph TB
    subgraph "Current Features"
        Auth[User Authentication]
        JobSearch[Job Search]
        AdminPanel[Admin Dashboard]
    end

    subgraph "Phase 1 - User Features"
        Favorites[Job Favorites]
        Applications[Application Tracking]
        Resume[Resume Upload]
        Profile[User Profile]
    end

    subgraph "Phase 2 - Advanced Features"
        Notifications[Email Notifications]
        Recommendations[Job Recommendations]
        Analytics[User Analytics]
        MultiSource[Multiple Job Sources]
    end

    subgraph "Phase 3 - Enterprise Features"
        RBAC[Role-Based Access Control]
        APIGateway[Public API]
        Export[Data Export - CSV/PDF]
        i18n[Multi-Language Support]
    end

    subgraph "New Database Layer"
        Firestore[(Firestore DB)]
        SavedJobs[(Saved Jobs)]
        Applications_DB[(Applications)]
        UserProfiles[(User Profiles)]
    end

    Auth --> Favorites
    JobSearch --> Favorites
    Favorites --> Firestore

    Favorites --> Applications
    Applications --> Applications_DB

    Resume --> Profile
    Profile --> UserProfiles

    Profile --> Recommendations
    JobSearch --> Recommendations

    AdminPanel --> Analytics
    Analytics --> Notifications

    JobSearch --> MultiSource

    AdminPanel --> RBAC
    RBAC --> APIGateway

    Analytics --> Export

    MultiSource --> i18n

    style Firestore fill:#4285f4,color:#fff
    style RBAC fill:#34a853,color:#fff
```

---

## Summary

This comprehensive UML documentation covers:

1. **System Architecture** - High-level component overview
2. **Class Diagram** - Core data models and relationships
3. **Component Hierarchy** - React component structure
4. **Sequence Diagrams** - Authentication, job search, and admin flows
5. **State Diagram** - User authentication lifecycle
6. **Use Case Diagram** - Actor interactions
7. **ERD** - Database/data structure (Firebase & External)
8. **API Routes** - Backend endpoint architecture
9. **Deployment Architecture** - Hosting and service integration
10. **Data Flow** - Complete user journey flows
11. **Technology Stack** - All frameworks and libraries
12. **Security Architecture** - Current security measures
13. **Future Enhancements** - Planned features and architecture

### Key Architectural Highlights:

- **Serverless Architecture**: Built on Next.js with API routes
- **Firebase-First**: Authentication and user management via Firebase
- **External Data**: Job data sourced from Reed API (not stored locally)
- **React Context**: Centralized authentication state management
- **Type-Safe**: Full TypeScript implementation
- **Component-Driven**: Reusable UI components with Tailwind CSS

### Recommended Improvements:

1. Add persistent job storage in Firestore
2. Implement proper admin authorization middleware
3. Add rate limiting to API routes
4. Move Reed API key to environment variables
5. Implement application tracking functionality
6. Add comprehensive error boundaries
7. Create user profile management system
