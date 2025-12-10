# Hirely - Test Documentation

## Document Information
- **Project Name:** Hirely
- **Version:** 1.0
- **Last Updated:** 2025-12-10
- **Document Type:** Test Specification and Test Scripts

---

## Table of Contents

1. [Testing Overview](#1-testing-overview)
2. [Unit Tests Specification](#2-unit-tests-specification)
3. [Integration Tests Specification](#3-integration-tests-specification)
4. [Acceptance (End-to-End) Tests](#4-acceptance-end-to-end-tests)
5. [Manual Test Scripts](#5-manual-test-scripts)
6. [Test Data Requirements](#6-test-data-requirements)
7. [Test Coverage Summary](#7-test-coverage-summary)
8. [Appendices](#8-appendices)

---

## 1. Testing Overview

### 1.1 Testing Strategy

The Hirely application testing strategy follows a three-tier approach:

```
┌─────────────────────────────────────────────┐
│         End-to-End Tests (Manual)           │
│    Full user journeys across the system     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       Integration Tests (Automated)         │
│    API endpoints, service interactions      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Unit Tests (Automated)              │
│    Individual functions and components      │
└─────────────────────────────────────────────┘
```

### 1.2 Testing Tools Recommended

| Test Type | Recommended Tools | Purpose |
|-----------|------------------|---------|
| **Unit Tests** | Jest, React Testing Library | Component and function testing |
| **Integration Tests** | Jest, Supertest | API endpoint testing |
| **E2E Tests** | Playwright, Cypress | Full user journey testing |
| **Mocking** | Jest Mock, MSW | Mock external services |
| **Coverage** | Jest Coverage | Code coverage analysis |

### 1.3 Test Environment Setup

**Required Environment Variables for Testing:**
```env
# Test Firebase Project
FIREBASE_API_KEY=test_api_key
FIREBASE_AUTH_DOMAIN=test-project.firebaseapp.com
FIREBASE_PROJECT_ID=test-project
FIREBASE_STORAGE_BUCKET=test-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=test_app_id

# Test Reed API (use sandbox if available)
REED_API_KEY=test_reed_api_key

# Admin SDK Test Credentials
FIREBASE_ADMIN_SERVICE_ACCOUNT=test_service_account.json
```

### 1.4 Testing Scope

| Module | Unit Tests | Integration Tests | E2E Tests | Status |
|--------|-----------|------------------|-----------|--------|
| Authentication | ✓ | ✓ | ✓ | Specified |
| Job Search | ✓ | ✓ | ✓ | Specified |
| Saved Jobs | ✓ | ✓ | ✓ | Specified |
| Chatbot | ✓ | ✓ | ✓ | Specified |
| Admin Dashboard | ✓ | ✓ | ✓ | Specified |
| UI Components | ✓ | - | ✓ | Specified |

---

## 2. Unit Tests Specification

### 2.1 Authentication Module Tests

#### File: `__tests__/context/AuthContext.test.tsx`

**Test Suite:** AuthContext Provider

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-AUTH-001** | `shouldInitializeWithDefaultState` | Verifies AuthContext initializes with correct default values | authState.isAuthenticated = false, user = null, isLoading = true |
| **UT-AUTH-002** | `shouldUpdateStateOnAuthChange` | Tests auth state updates when Firebase auth state changes | authState reflects Firebase user |
| **UT-AUTH-003** | `shouldConvertFirebaseUserToUserData` | Tests conversion of Firebase User to UserData interface | UserData contains all required fields |
| **UT-AUTH-004** | `shouldHandleSignInSuccess` | Tests successful sign-in operation | Returns User object, authState updated |
| **UT-AUTH-005** | `shouldHandleSignInFailure` | Tests sign-in with invalid credentials | Throws error, isLoading = false |
| **UT-AUTH-006** | `shouldHandleSignUpSuccess` | Tests successful user registration | Creates user, sends verification email |
| **UT-AUTH-007** | `shouldHandleSignUpFailure` | Tests sign-up with existing email | Throws error with appropriate message |
| **UT-AUTH-008** | `shouldHandleLogoutSuccess` | Tests user sign-out operation | authState reset to default, user = null |
| **UT-AUTH-009** | `shouldSendPasswordResetEmail` | Tests password reset email sending | No error thrown, Firebase method called |
| **UT-AUTH-010** | `shouldSendVerificationEmail` | Tests email verification sending | Verification email sent to current user |
| **UT-AUTH-011** | `shouldUpdateUserProfile` | Tests profile update (displayName, photoURL) | Profile updated, authState reflects changes |
| **UT-AUTH-012** | `shouldRefreshUserData` | Tests user data refresh from Firebase | Current user reloaded, state updated |
| **UT-AUTH-013** | `shouldThrowErrorWhenNoUserForVerification` | Tests verification email without authenticated user | Throws "No authenticated user found" |
| **UT-AUTH-014** | `shouldThrowErrorWhenNoUserForProfileUpdate` | Tests profile update without authenticated user | Throws appropriate error |

**Test Dependencies:**
- Mock Firebase Auth SDK
- Mock onAuthStateChanged listener
- Test user fixtures

---

#### File: `__tests__/hooks/useAuth.test.tsx`

**Test Suite:** useAuth Hook

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-HOOK-001** | `shouldReturnAuthContextValue` | Tests hook returns correct context value | Returns AuthContextValue object |
| **UT-HOOK-002** | `shouldThrowErrorWhenUsedOutsideProvider` | Tests hook used without AuthProvider | Throws "must be used within AuthProvider" |
| **UT-HOOK-003** | `shouldProvideAllAuthMethods` | Verifies all methods are available | signIn, signUp, logout, etc. all defined |

---

### 2.2 Saved Jobs Service Tests

#### File: `__tests__/utils/savedJobs.test.ts`

**Test Suite:** SavedJobsService

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-JOBS-001** | `getSavedJobs_shouldReturnEmptyArrayWhenNoUser` | Tests getSavedJobs when user not authenticated | Returns empty array |
| **UT-JOBS-002** | `getSavedJobs_shouldReturnUserSavedJobs` | Tests retrieving saved jobs for authenticated user | Returns array of SavedJob objects |
| **UT-JOBS-003** | `getSavedJobs_shouldSortByNewestFirst` | Tests jobs sorted by savedAt descending | First job has latest savedAt timestamp |
| **UT-JOBS-004** | `saveJob_shouldReturnFalseWhenNoUser` | Tests saving job when not authenticated | Returns false, logs error |
| **UT-JOBS-005** | `saveJob_shouldSaveJobSuccessfully` | Tests successful job save | Returns true, job added to Firestore |
| **UT-JOBS-006** | `saveJob_shouldPreventDuplicateSaves` | Tests saving already-saved job | Returns false, no duplicate created |
| **UT-JOBS-007** | `saveJob_shouldIncludeTimestamp` | Tests savedAt timestamp is added | Document includes Firestore timestamp |
| **UT-JOBS-008** | `saveJob_shouldRemoveUndefinedFields` | Tests undefined fields are cleaned | Only defined fields saved to Firestore |
| **UT-JOBS-009** | `unsaveJob_shouldRemoveJobSuccessfully` | Tests successful job removal | Returns true, job deleted from Firestore |
| **UT-JOBS-010** | `unsaveJob_shouldReturnFalseWhenJobNotFound` | Tests removing non-existent job | Returns false, logs "not found" |
| **UT-JOBS-011** | `unsaveJob_shouldReturnFalseWhenNoUser` | Tests removing job when not authenticated | Returns false |
| **UT-JOBS-012** | `isJobSaved_shouldReturnTrueForSavedJob` | Tests checking if job is saved (true case) | Returns true |
| **UT-JOBS-013** | `isJobSaved_shouldReturnFalseForUnsavedJob` | Tests checking if job is saved (false case) | Returns false |
| **UT-JOBS-014** | `isJobSaved_shouldReturnFalseWhenNoUser` | Tests checking saved status when not authenticated | Returns false |
| **UT-JOBS-015** | `clearAllSavedJobs_shouldDeleteAllUserJobs` | Tests clearing all saved jobs | All user's jobs deleted, returns true |
| **UT-JOBS-016** | `clearAllSavedJobs_shouldReturnFalseWhenNoUser` | Tests clearing jobs when not authenticated | Returns false |
| **UT-JOBS-017** | `saveJob_shouldHandleFirestoreError` | Tests error handling when Firestore fails | Returns false, logs error |

**Test Dependencies:**
- Mock Firestore SDK
- Mock Firebase Auth (currentUser)
- Test job fixtures

---

### 2.3 API Route Tests

#### File: `__tests__/api/jobs/route.test.ts`

**Test Suite:** Jobs API - GET /api/jobs

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-001** | `shouldReturnJobsWithValidParameters` | Tests successful job retrieval | Status 200, returns jobs array |
| **UT-API-002** | `shouldHandleEmptyKeywords` | Tests request with no keywords | Returns jobs, uses default parameters |
| **UT-API-003** | `shouldPassParametersToReedAPI` | Tests parameters forwarded to Reed API | Reed API called with correct params |
| **UT-API-004** | `shouldHandleReedAPIError` | Tests error when Reed API fails | Status 500, error message returned |
| **UT-API-005** | `shouldUseEnvironmentAPIKey` | Tests API key from environment variable | Uses process.env.REED_API_KEY |
| **UT-API-006** | `shouldEncodeAuthorizationHeader` | Tests Basic auth header encoding | Header correctly formatted with Base64 |

**Test Dependencies:**
- Mock Axios
- Mock Reed API responses
- Mock environment variables

---

#### File: `__tests__/api/jobs/search/route.test.ts`

**Test Suite:** Jobs API - GET /api/jobs/search

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-007** | `shouldTransformReedAPIResponse` | Tests response transformation | Response includes jobs, totalResults, pagination |
| **UT-API-008** | `shouldHandleAllSearchParameters` | Tests with all search parameters | All params passed to Reed API |
| **UT-API-009** | `shouldCalculatePaginationMetadata` | Tests pagination calculation | Correct currentPage, totalPages calculated |
| **UT-API-010** | `shouldDefaultToPage1` | Tests default pagination values | resultsToSkip = 0, resultsToTake = 20 |
| **UT-API-011** | `shouldHandleLocationFilter` | Tests location-based search | Location parameter passed correctly |
| **UT-API-012** | `shouldHandleSalaryFilter` | Tests salary range filtering | Min/max salary parameters included |

---

#### File: `__tests__/api/jobs/[jobId]/route.test.ts`

**Test Suite:** Jobs API - GET /api/jobs/[jobId]

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-013** | `shouldReturnJobDetailsForValidId` | Tests fetching specific job | Returns single job object |
| **UT-API-014** | `shouldReturn404ForInvalidJobId` | Tests with non-existent job ID | Status 404, error message |
| **UT-API-015** | `shouldForwardJobIdToReedAPI` | Tests jobId parameter forwarding | Reed API called with correct jobId |

---

#### File: `__tests__/api/users/route.test.ts`

**Test Suite:** Users API - GET /api/users

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-016** | `shouldReturnAllUsers` | Tests listing all users | Returns users array, statistics |
| **UT-API-017** | `shouldCalculateUserStatistics` | Tests statistics calculation | Correct totalUsers, verifiedUsers, unverifiedUsers |
| **UT-API-018** | `shouldHandlePagination` | Tests pagination with maxResults, pageToken | Returns correct page of users |
| **UT-API-019** | `shouldHandleMissingAdminCredentials` | Tests when Firebase Admin not configured | Returns appropriate error |
| **UT-API-020** | `shouldTransformUserRecords` | Tests Firebase UserRecord to UserInfo transformation | Correct fields mapped |

**Test Suite:** Users API - POST /api/users

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-021** | `shouldCreateUserSuccessfully` | Tests successful user creation | Status 201, returns user data |
| **UT-API-022** | `shouldValidateEmailFormat` | Tests email validation | Rejects invalid email format |
| **UT-API-023** | `shouldValidatePasswordLength` | Tests password minimum length | Rejects password < 6 characters |
| **UT-API-024** | `shouldHandleDuplicateEmail` | Tests creating user with existing email | Status 400, error message |
| **UT-API-025** | `shouldSetEmailVerifiedFlag` | Tests emailVerified parameter | User created with correct verification status |
| **UT-API-026** | `shouldSetDisplayName` | Tests displayName parameter | User created with display name |

---

#### File: `__tests__/api/users/[uid]/route.test.ts`

**Test Suite:** Users API - DELETE /api/users/[uid]

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-027** | `shouldDeleteUserSuccessfully` | Tests successful user deletion | Status 200, success message |
| **UT-API-028** | `shouldHandleInvalidUID` | Tests deletion with invalid UID | Status 404, error message |
| **UT-API-029** | `shouldCallFirebaseAdminDelete` | Tests Firebase Admin deleteUser called | deleteUser method invoked with UID |

---

#### File: `__tests__/api/chatbot/route.test.ts`

**Test Suite:** Chatbot API - POST /api/chatbot

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-API-030** | `shouldRespondToSalaryQuestion` | Tests salary-related question | Response includes salary information |
| **UT-API-031** | `shouldRespondToLocationQuestion` | Tests location-related question | Response includes location information |
| **UT-API-032** | `shouldRespondToRequirementsQuestion` | Tests requirements question | Response includes job requirements |
| **UT-API-033** | `shouldRespondToCompanyQuestion` | Tests company-related question | Response includes employer name |
| **UT-API-034** | `shouldRespondToApplicationQuestion` | Tests "how to apply" question | Response includes application instructions |
| **UT-API-035** | `shouldHandleUnrecognizedQuestion` | Tests question that doesn't match patterns | Returns fallback response |
| **UT-API-036** | `shouldRequireMessageField` | Tests request without message | Status 400, validation error |
| **UT-API-037** | `shouldHandleMissingJobDetails` | Tests chatbot without job details | Returns generic response |

---

### 2.4 Component Tests

#### File: `__tests__/components/NavBar.test.tsx`

**Test Suite:** NavBar Component

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-COMP-001** | `shouldRenderLogoAndBranding` | Tests logo rendering | Logo image/text visible |
| **UT-COMP-002** | `shouldShowSignInWhenNotAuthenticated` | Tests unauthenticated state | "Sign In" and "Sign Up" buttons visible |
| **UT-COMP-003** | `shouldShowUserInfoWhenAuthenticated` | Tests authenticated state | User display name/email visible |
| **UT-COMP-004** | `shouldShowSavedJobsLinkWhenAuthenticated` | Tests saved jobs link visibility | "Saved Jobs" link visible for auth users |
| **UT-COMP-005** | `shouldCallLogoutOnSignOut` | Tests sign-out button functionality | logout() method called when clicked |
| **UT-COMP-006** | `shouldToggleMobileMenu` | Tests mobile menu toggle | Menu opens/closes on button click |
| **UT-COMP-007** | `shouldUpdateOnScroll` | Tests scroll event handling | Styling changes on scroll |

---

#### File: `__tests__/components/JobBoard.test.tsx`

**Test Suite:** JobBoard Component

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-COMP-008** | `shouldRenderAllJobs` | Tests rendering job list | All jobs in props are rendered |
| **UT-COMP-009** | `shouldDisplayJobInformation` | Tests job card content | Title, company, location, salary visible |
| **UT-COMP-010** | `shouldShowSaveButtonWhenAuthenticated` | Tests save button visibility | Save icon visible for auth users |
| **UT-COMP-011** | `shouldHideSaveButtonWhenNotAuthenticated` | Tests save button hidden | No save button for unauthenticated users |
| **UT-COMP-012** | `shouldCallSaveJobOnClick` | Tests save job functionality | saveJob() called with correct job data |
| **UT-COMP-013** | `shouldShowSavedStateForSavedJobs` | Tests visual indication of saved jobs | Saved jobs have filled bookmark icon |
| **UT-COMP-014** | `shouldCallUnsaveJobOnClick` | Tests unsave functionality | unsaveJob() called when clicking saved job |
| **UT-COMP-015** | `shouldShowLoadingStateDuringSave` | Tests loading indicator | Loading state shown during async operation |
| **UT-COMP-016** | `shouldFilterJobsBySalary` | Tests salary filtering | Only jobs within range shown |
| **UT-COMP-017** | `shouldFilterJobsByLocation` | Tests location filtering | Only jobs in selected location shown |
| **UT-COMP-018** | `shouldNavigateToJobDetailsOnClick` | Tests job card click | Navigates to /jobs/[jobId] |

---

#### File: `__tests__/components/JobSearchComponent.test.tsx`

**Test Suite:** JobSearchComponent

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-COMP-019** | `shouldRenderSearchForm` | Tests form rendering | Keywords, location inputs visible |
| **UT-COMP-020** | `shouldUpdateKeywordsInput` | Tests keywords input change | State updated on input change |
| **UT-COMP-021** | `shouldUpdateLocationInput` | Tests location input change | State updated on input change |
| **UT-COMP-022** | `shouldCallAPIOnSubmit` | Tests form submission | API called with search parameters |
| **UT-COMP-023** | `shouldShowLoadingDuringSearch` | Tests loading state | Loading indicator shown during API call |
| **UT-COMP-024** | `shouldDisplaySearchResults` | Tests results display | Results rendered after API response |
| **UT-COMP-025** | `shouldHandleSearchError` | Tests error handling | Error message displayed on API failure |
| **UT-COMP-026** | `shouldResetSearchForm` | Tests form reset | All inputs cleared on reset button click |

---

#### File: `__tests__/components/JobChatbot.test.tsx`

**Test Suite:** JobChatbot Component

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-COMP-027** | `shouldRenderChatbotWidget` | Tests chatbot widget rendering | Chatbot button/widget visible |
| **UT-COMP-028** | `shouldToggleChatbotVisibility` | Tests open/close functionality | Chatbot opens and closes on click |
| **UT-COMP-029** | `shouldDisplayMessages` | Tests message display | All messages in history rendered |
| **UT-COMP-030** | `shouldSendMessageOnSubmit` | Tests message sending | API called with message and job details |
| **UT-COMP-031** | `shouldDisplayBotResponse` | Tests bot response display | Bot message added to conversation |
| **UT-COMP-032** | `shouldShowLoadingIndicator` | Tests loading state | Loading indicator shown while waiting |
| **UT-COMP-033** | `shouldClearInputAfterSend` | Tests input clearing | Input field cleared after sending message |
| **UT-COMP-034** | `shouldScrollToLatestMessage` | Tests auto-scroll | Latest message scrolled into view |

---

#### File: `__tests__/components/JobCategory.test.tsx`

**Test Suite:** JobCategory Component

| Test ID | Test Method Name | Description | Assertions |
|---------|-----------------|-------------|------------|
| **UT-COMP-035** | `shouldRenderAllCategories` | Tests category cards rendering | All category cards displayed |
| **UT-COMP-036** | `shouldDisplayCategoryInfo` | Tests category card content | Name and icon visible |
| **UT-COMP-037** | `shouldNavigateOnCategoryClick` | Tests navigation | Navigates to /category/[name] on click |

---

## 3. Integration Tests Specification

### 3.1 API Integration Tests

#### File: `__tests__/integration/jobs-api.integration.test.ts`

**Test Suite:** Jobs API Integration

| Test ID | Test Method Name | Description | Test Flow |
|---------|-----------------|-------------|-----------|
| **IT-JOBS-001** | `shouldFetchJobsFromReedAPI` | Tests end-to-end job fetching | Call /api/jobs → Reed API → Return jobs |
| **IT-JOBS-002** | `shouldSearchJobsWithFilters` | Tests search with multiple filters | Call /api/jobs/search with params → Filtered results |
| **IT-JOBS-003** | `shouldGetJobDetailsById` | Tests job details retrieval | Call /api/jobs/[jobId] → Single job returned |
| **IT-JOBS-004** | `shouldHandleReedAPIRateLimit` | Tests rate limiting handling | Multiple rapid requests → Proper error handling |
| **IT-JOBS-005** | `shouldHandleReedAPITimeout` | Tests timeout scenarios | Slow Reed API → Timeout error returned |

**Test Environment:**
- Use Reed API sandbox or mocked responses
- Test API key in environment variables
- Network request timeout: 10 seconds

---

#### File: `__tests__/integration/auth-firestore.integration.test.ts`

**Test Suite:** Authentication and Firestore Integration

| Test ID | Test Method Name | Description | Test Flow |
|---------|-----------------|-------------|-----------|
| **IT-AUTH-001** | `shouldCreateUserAndSaveJob` | Tests user creation and job saving | Sign up → Save job → Verify in Firestore |
| **IT-AUTH-002** | `shouldPreventUnauthenticatedJobSave` | Tests auth requirement for saving | Attempt save without auth → Rejected |
| **IT-AUTH-003** | `shouldDeleteUserAndCleanupJobs` | Tests cascade deletion | Delete user → Verify saved jobs remain/delete |
| **IT-AUTH-004** | `shouldIsolateUserSavedJobs` | Tests user data isolation | User A saves job → User B doesn't see it |

**Test Environment:**
- Firebase Test Project
- Test Firestore database
- Test user credentials

---

#### File: `__tests__/integration/admin-operations.integration.test.ts`

**Test Suite:** Admin Operations Integration

| Test ID | Test Method Name | Description | Test Flow |
|---------|-----------------|-------------|-----------|
| **IT-ADMIN-001** | `shouldCreateAndListNewUser` | Tests user creation and listing | POST /api/users → GET /api/users → User in list |
| **IT-ADMIN-002** | `shouldDeleteUserSuccessfully` | Tests user deletion | Create user → Delete user → Verify removed |
| **IT-ADMIN-003** | `shouldUpdateUserStatistics` | Tests statistics after operations | Initial stats → Create user → Updated stats |
| **IT-ADMIN-004** | `shouldHandleFirebaseAdminErrors` | Tests Firebase Admin error handling | Invalid credentials → Proper error response |

---

### 3.2 Service Integration Tests

#### File: `__tests__/integration/saved-jobs-service.integration.test.ts`

**Test Suite:** SavedJobsService Integration

| Test ID | Test Method Name | Description | Test Flow |
|---------|-----------------|-------------|-----------|
| **IT-SVC-001** | `shouldSaveJobToFirestore` | Tests job save to Firestore | saveJob() → Verify in Firestore → getSavedJobs() contains job |
| **IT-SVC-002** | `shouldPreventDuplicateSaves` | Tests duplicate prevention | Save job twice → Only one document in Firestore |
| **IT-SVC-003** | `shouldUnsaveJobFromFirestore` | Tests job removal | Save job → Unsave → Verify removed from Firestore |
| **IT-SVC-004** | `shouldMaintainTimestamps` | Tests timestamp accuracy | Save job → Verify savedAt is recent timestamp |
| **IT-SVC-005** | `shouldSortJobsByRecency` | Tests sorting logic | Save 3 jobs at different times → getSavedJobs() returns newest first |

---

## 4. Acceptance (End-to-End) Tests

### 4.1 Automated E2E Tests (Recommended)

#### File: `e2e/auth-flow.spec.ts`

**Test Suite:** Authentication User Journey

| Test ID | Test Name | User Flow | Verification Points |
|---------|-----------|-----------|-------------------|
| **E2E-AUTH-001** | `completeUserRegistrationFlow` | Sign up → Verify email → Sign in | Account created, email verified, signed in |
| **E2E-AUTH-002** | `signInAndSignOutFlow` | Sign in → Navigate site → Sign out | Authenticated, then logged out |
| **E2E-AUTH-003** | `passwordResetFlow` | Forgot password → Reset email → New password → Sign in | Password changed, can sign in |

---

#### File: `e2e/job-search-flow.spec.ts`

**Test Suite:** Job Search and Discovery Journey

| Test ID | Test Name | User Flow | Verification Points |
|---------|-----------|-----------|-------------------|
| **E2E-SEARCH-001** | `searchAndViewJobDetails` | Search jobs → Click job → View details | Results displayed, details page loaded |
| **E2E-SEARCH-002** | `filterJobsByCategory` | Home → Click category → View category jobs | Category jobs displayed |
| **E2E-SEARCH-003** | `paginateSearchResults` | Search → Page 2 → Page 3 | Different jobs on each page |

---

#### File: `e2e/saved-jobs-flow.spec.ts`

**Test Suite:** Job Saving Journey

| Test ID | Test Name | User Flow | Verification Points |
|---------|-----------|-----------|-------------------|
| **E2E-SAVE-001** | `saveAndViewJob` | Sign in → Search → Save job → View saved jobs | Job appears in saved jobs |
| **E2E-SAVE-002** | `unsaveJob` | View saved jobs → Unsave → Refresh | Job removed from saved jobs |
| **E2E-SAVE-003** | `savedJobsPersistAcrossSessions` | Save job → Sign out → Sign in → View saved jobs | Job still saved |

---

#### File: `e2e/chatbot-flow.spec.ts`

**Test Suite:** Chatbot Interaction Journey

| Test ID | Test Name | User Flow | Verification Points |
|---------|-----------|-----------|-------------------|
| **E2E-CHAT-001** | `askChatbotAboutJob` | View job → Open chatbot → Ask about salary | Chatbot responds with salary info |
| **E2E-CHAT-002** | `multiTurnChatbotConversation` | Open chatbot → Ask 3 questions | All questions answered, history maintained |

---

#### File: `e2e/admin-flow.spec.ts`

**Test Suite:** Admin Dashboard Journey

| Test ID | Test Name | User Flow | Verification Points |
|---------|-----------|-----------|-------------------|
| **E2E-ADMIN-001** | `createUserViaAdmin` | Admin dashboard → Create user → View users | New user in list |
| **E2E-ADMIN-002** | `deleteUserViaAdmin` | Admin dashboard → Delete user → Confirm | User removed from list |
| **E2E-ADMIN-003** | `viewUserStatistics` | Admin dashboard → View stats | Correct counts displayed |

---

## 5. Manual Test Scripts

### 5.1 Authentication Module Manual Tests

---

#### **TEST-MANUAL-001: User Registration**

**Objective:** Verify user can successfully register an account

**Pre-conditions:**
- Application is running and accessible
- Email address not previously registered
- Valid internet connection

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to application homepage | URL: http://localhost:3000 | Homepage loads successfully | | |
| 2 | Click "Sign Up" button in navigation | Click event | Redirected to /sign-up page | | |
| 3 | Enter email address | Email: testuser001@example.com | Email input accepts value | | |
| 4 | Enter password | Password: TestPass123 | Password input masked, accepts value | | |
| 5 | Enter confirm password | Password: TestPass123 | Confirm password input matches | | |
| 6 | Click "Sign Up" button | Click event | Loading indicator appears | | |
| 7 | Wait for response | - | Redirected to email verification page | | |
| 8 | Check email inbox | Email: testuser001@example.com | Verification email received within 1 minute | | |
| 9 | Verify email content | - | Email contains "Verify your email" subject | | |
| 10 | Verify email contains link | - | Clickable verification link present | | |

**Expected Outcome:**
- User account created in Firebase
- User redirected to verification page
- Verification email sent successfully
- No error messages displayed

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Email: testuser001@example.com
Password: TestPass123
Expected UID: (Generated by Firebase)
```

**Post-conditions:**
- User account exists in Firebase Auth
- User emailVerified status = false
- No saved jobs associated with account

---

#### **TEST-MANUAL-002: User Sign-In**

**Objective:** Verify registered user can sign in successfully

**Pre-conditions:**
- User account exists (from TEST-MANUAL-001)
- Email verified (manual verification via Firebase Console acceptable)
- User currently signed out

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to sign-in page | URL: http://localhost:3000/sign-in | Sign-in page loads | | |
| 2 | Enter registered email | Email: testuser001@example.com | Email input accepts value | | |
| 3 | Enter correct password | Password: TestPass123 | Password input masked, accepts value | | |
| 4 | Click "Sign In" button | Click event | Loading indicator appears | | |
| 5 | Wait for authentication | - | Redirected to homepage within 2 seconds | | |
| 6 | Check navigation bar | - | Display name or email visible in nav | | |
| 7 | Check for "Saved Jobs" link | - | "Saved Jobs" link visible in navigation | | |
| 8 | Check for "Sign Out" option | - | "Sign Out" button/link visible | | |

**Expected Outcome:**
- User successfully authenticated
- Redirected to homepage
- Navigation shows authenticated state
- No error messages

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Email: testuser001@example.com
Password: TestPass123
Expected Redirect: http://localhost:3000/
```

---

#### **TEST-MANUAL-003: Invalid Sign-In Credentials**

**Objective:** Verify appropriate error handling for incorrect credentials

**Pre-conditions:**
- User account exists
- User currently signed out

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to sign-in page | URL: http://localhost:3000/sign-in | Sign-in page loads | | |
| 2 | Enter registered email | Email: testuser001@example.com | Email input accepts value | | |
| 3 | Enter incorrect password | Password: WrongPassword123 | Password input masked, accepts value | | |
| 4 | Click "Sign In" button | Click event | Loading indicator appears briefly | | |
| 5 | Wait for response | - | Error message displayed within 2 seconds | | |
| 6 | Verify error message | - | Message: "Invalid email or password" or similar | | |
| 7 | Verify still on sign-in page | - | Not redirected, still at /sign-in | | |
| 8 | Verify user not authenticated | - | Navigation still shows "Sign In" button | | |

**Expected Outcome:**
- Authentication fails
- Clear error message displayed
- User remains on sign-in page
- No authentication state change

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Email: testuser001@example.com
Wrong Password: WrongPassword123
Expected Error: "Invalid email or password" or Firebase error
```

---

#### **TEST-MANUAL-004: Password Reset**

**Objective:** Verify password reset functionality works correctly

**Pre-conditions:**
- User account exists
- User currently signed out
- Access to email inbox

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to sign-in page | URL: http://localhost:3000/sign-in | Sign-in page loads | | |
| 2 | Click "Forgot Password" link | Click event | Password reset modal/page appears | | |
| 3 | Enter registered email | Email: testuser001@example.com | Email input accepts value | | |
| 4 | Click "Send Reset Email" button | Click event | Loading indicator appears | | |
| 5 | Wait for response | - | Success message displayed within 2 seconds | | |
| 6 | Check email inbox | Email: testuser001@example.com | Password reset email received within 1 minute | | |
| 7 | Verify email content | - | Email contains "Reset your password" subject | | |
| 8 | Click reset link in email | Click event | Opens Firebase password reset page | | |
| 9 | Enter new password | Password: NewTestPass456 | Password input accepts value | | |
| 10 | Confirm new password | Password: NewTestPass456 | Confirm password matches | | |
| 11 | Submit new password | Click event | Success message displayed | | |
| 12 | Return to sign-in page | Navigate to /sign-in | Sign-in page loads | | |
| 13 | Sign in with new password | Email: testuser001@example.com, Password: NewTestPass456 | Successfully signed in | | |

**Expected Outcome:**
- Reset email sent successfully
- User can set new password
- User can sign in with new password
- Old password no longer works

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Email: testuser001@example.com
Old Password: TestPass123
New Password: NewTestPass456
```

---

#### **TEST-MANUAL-005: User Sign-Out**

**Objective:** Verify user can sign out and session is cleared

**Pre-conditions:**
- User signed in
- On homepage or any page

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Verify signed in state | - | User info visible in navigation | | |
| 2 | Click "Sign Out" button | Click event | Loading indicator may appear briefly | | |
| 3 | Wait for response | - | Redirected to homepage within 1 second | | |
| 4 | Check navigation bar | - | "Sign In" and "Sign Up" buttons visible | | |
| 5 | Check for authentication features | - | "Saved Jobs" link NOT visible | | |
| 6 | Attempt to access /saved-jobs | Navigate to /saved-jobs | Redirected to sign-in or shown error | | |
| 7 | Refresh page | Browser refresh | User remains signed out | | |

**Expected Outcome:**
- User signed out successfully
- Navigation shows unauthenticated state
- Protected routes inaccessible
- Session cleared (persists across refresh)

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

### 5.2 Job Search Module Manual Tests

---

#### **TEST-MANUAL-006: Basic Job Search**

**Objective:** Verify job search functionality returns relevant results

**Pre-conditions:**
- Application running
- Reed API accessible
- Internet connection available

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to homepage | URL: http://localhost:3000 | Homepage loads | | |
| 2 | Click "Search Jobs" link | Click event | Redirected to /search page | | |
| 3 | Enter job keywords | Keywords: "Software Engineer" | Input accepts value | | |
| 4 | Enter location | Location: "London" | Input accepts value | | |
| 5 | Click "Search" button | Click event | Loading indicator appears | | |
| 6 | Wait for results | - | Job results displayed within 3 seconds | | |
| 7 | Verify results relevance | - | Job titles contain "Software" or "Engineer" | | |
| 8 | Verify location accuracy | - | Job locations show "London" or nearby | | |
| 9 | Count results | - | At least 5 jobs displayed | | |
| 10 | Check job card information | - | Each job shows: Title, Company, Location, Salary | | |

**Expected Outcome:**
- Search executes successfully
- Results returned within 3 seconds
- Jobs relevant to search terms
- Minimum 5 results displayed (if available)
- All job cards show required information

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Keywords: Software Engineer
Location: London
Expected: 5+ results
Response Time: < 3 seconds
```

---

#### **TEST-MANUAL-007: Job Search with No Results**

**Objective:** Verify appropriate message when no jobs match search

**Pre-conditions:**
- Application running
- Reed API accessible

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to search page | URL: http://localhost:3000/search | Search page loads | | |
| 2 | Enter unlikely keywords | Keywords: "xyzabc123nonexistent" | Input accepts value | | |
| 3 | Click "Search" button | Click event | Loading indicator appears | | |
| 4 | Wait for response | - | Response received within 3 seconds | | |
| 5 | Check for results | - | No job cards displayed | | |
| 6 | Check for message | - | "No jobs found" or similar message displayed | | |
| 7 | Verify search form still visible | - | Can perform new search without page reload | | |

**Expected Outcome:**
- Search executes without error
- "No results" message displayed
- User can perform new search
- No blank/broken state

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Keywords: xyzabc123nonexistent
Expected: 0 results
Expected Message: "No jobs found" or similar
```

---

#### **TEST-MANUAL-008: View Job Details**

**Objective:** Verify job details page displays complete information

**Pre-conditions:**
- Job search results displayed
- At least one job in results

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Perform job search | Keywords: "Developer" | Results displayed | | |
| 2 | Click first job card | Click event | Redirected to /jobs/[jobId] | | |
| 3 | Wait for page load | - | Job details page loads within 2 seconds | | |
| 4 | Verify job title displayed | - | Job title visible and prominent | | |
| 5 | Verify employer name | - | Company/employer name displayed | | |
| 6 | Verify location | - | Location information shown | | |
| 7 | Verify salary range | - | Salary min/max and currency displayed | | |
| 8 | Verify job description | - | Full HTML-formatted description visible | | |
| 9 | Verify "Apply Now" button | - | Button visible and labeled clearly | | |
| 10 | Verify chatbot widget | - | Chatbot icon/widget present | | |
| 11 | Check for save button | - | "Save Job" button visible (if authenticated) | | |

**Expected Outcome:**
- Job details page loads successfully
- All information displayed clearly
- Apply button functional
- Save button visible for authenticated users
- Chatbot available

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Search Keywords: Developer
Job ID: (First result)
Expected Fields: Title, Company, Location, Salary, Description, Apply button
```

---

#### **TEST-MANUAL-009: Browse Jobs by Category**

**Objective:** Verify category browsing functionality

**Pre-conditions:**
- Application running
- On homepage

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to homepage | URL: http://localhost:3000 | Homepage loads | | |
| 2 | Locate job categories section | Scroll if needed | Job category cards visible | | |
| 3 | Count category cards | - | At least 4 categories displayed | | |
| 4 | Click "Technology" category | Click event | Redirected to /category/Technology | | |
| 5 | Wait for jobs to load | - | Technology jobs displayed within 3 seconds | | |
| 6 | Verify page title | - | "Technology Jobs" or similar heading | | |
| 7 | Verify job relevance | - | Job titles related to technology | | |
| 8 | Click back/home | Navigation | Return to homepage | | |
| 9 | Click "Healthcare" category | Click event | Healthcare jobs displayed | | |

**Expected Outcome:**
- Category cards displayed on homepage
- Clicking category shows relevant jobs
- Page title reflects selected category
- Jobs match category context

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Categories to test: Technology, Healthcare
Expected: Category-specific jobs
Page URL: /category/[CategoryName]
```

---

#### **TEST-MANUAL-010: Job Search Pagination**

**Objective:** Verify pagination works correctly for search results

**Pre-conditions:**
- Search returns more than 20 results

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Perform broad search | Keywords: "Manager" | Search returns 20+ results | | |
| 2 | Count results on page 1 | - | Exactly 20 jobs displayed | | |
| 3 | Locate pagination controls | Scroll to bottom | Pagination buttons visible | | |
| 4 | Note first job title on page 1 | - | Record job title for comparison | | |
| 5 | Click "Next" or "Page 2" button | Click event | Page 2 loads | | |
| 6 | Wait for page load | - | New jobs displayed within 2 seconds | | |
| 7 | Verify different jobs | - | Jobs on page 2 different from page 1 | | |
| 8 | Click "Previous" or "Page 1" | Click event | Return to page 1 | | |
| 9 | Verify same jobs | - | First job matches recorded title | | |

**Expected Outcome:**
- Pagination controls displayed
- Page navigation works
- Each page shows different jobs
- 20 jobs per page (or configured amount)
- Navigation preserves search parameters

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Keywords: Manager
Expected Results: 40+ jobs
Jobs per page: 20
Pages to test: 1, 2
```

---

### 5.3 Saved Jobs Module Manual Tests

---

#### **TEST-MANUAL-011: Save Job**

**Objective:** Verify authenticated user can save a job

**Pre-conditions:**
- User signed in
- Viewing job details or search results
- Job not already saved

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Ensure user signed in | Check navigation | User info visible in nav | | |
| 2 | Navigate to job details | Any job | Job details page loads | | |
| 3 | Locate "Save Job" button | - | Bookmark/save icon visible | | |
| 4 | Verify icon state | - | Icon is unfilled/outline (not saved) | | |
| 5 | Click "Save Job" button | Click event | Loading indicator appears briefly | | |
| 6 | Wait for response | - | Success message/notification displayed | | |
| 7 | Verify icon state changed | - | Icon is filled/solid (saved state) | | |
| 8 | Navigate to "Saved Jobs" | Click saved jobs link in nav | Redirected to /saved-jobs | | |
| 9 | Verify job in list | - | Saved job appears in list | | |
| 10 | Verify job information | - | Job title, company, location match original | | |

**Expected Outcome:**
- Job saved successfully
- Visual feedback provided
- Icon state changes to "saved"
- Job appears in saved jobs list
- Save persists (check in Firestore)

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Job Title: (Record from test)
Job ID: (Record from test)
Expected: Job in Firestore savedJobs collection with userId
```

---

#### **TEST-MANUAL-012: Prevent Duplicate Save**

**Objective:** Verify system prevents saving the same job twice

**Pre-conditions:**
- User signed in
- Job already saved (from TEST-MANUAL-011)

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to saved job details | Click saved job | Job details page loads | | |
| 2 | Verify icon state | - | Icon is filled (indicating saved) | | |
| 3 | Click save icon again | Click event | Message: "Job already saved" or no action | | |
| 4 | Navigate to saved jobs | Click saved jobs link | Saved jobs list loads | | |
| 5 | Count instances of job | - | Job appears only once in list | | |
| 6 | Verify in Firestore (dev tools) | - | Only one document for this job+user | | |

**Expected Outcome:**
- Cannot save job twice
- Appropriate feedback given
- Only one instance in saved jobs
- No duplicate Firestore documents

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

#### **TEST-MANUAL-013: Unsave Job**

**Objective:** Verify user can remove job from saved collection

**Pre-conditions:**
- User signed in
- At least one job saved

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to saved jobs | URL: /saved-jobs | Saved jobs list loads | | |
| 2 | Count saved jobs | - | At least 1 job visible | | |
| 3 | Note job title to remove | - | Record job title | | |
| 4 | Locate "Remove" or "X" button | - | Remove button visible on job card | | |
| 5 | Click remove button | Click event | Confirmation modal may appear | | |
| 6 | Confirm removal (if prompted) | Click confirm | Loading indicator appears briefly | | |
| 7 | Wait for response | - | Job disappears from list within 1 second | | |
| 8 | Verify job removed | - | Job no longer in saved jobs list | | |
| 9 | Navigate to job details | View removed job | Job details page loads | | |
| 10 | Verify save icon state | - | Icon is unfilled (not saved) | | |

**Expected Outcome:**
- Job removed successfully
- Job disappears from list immediately
- Icon state updates on details page
- Firestore document deleted

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Job to remove: (Record title)
Expected: Job removed from Firestore
Expected: Icon state = unsaved
```

---

#### **TEST-MANUAL-014: Saved Jobs Persistence**

**Objective:** Verify saved jobs persist across sessions

**Pre-conditions:**
- User signed in
- At least one job saved

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to saved jobs | URL: /saved-jobs | Saved jobs list loads | | |
| 2 | Count saved jobs | - | Record count (e.g., 3 jobs) | | |
| 3 | Note job titles | - | Record titles of all saved jobs | | |
| 4 | Sign out | Click sign out | User signed out successfully | | |
| 5 | Close browser/tab | - | Browser closed | | |
| 6 | Reopen browser | Open new tab | Browser reopened | | |
| 7 | Navigate to application | URL: http://localhost:3000 | Homepage loads | | |
| 8 | Sign in | Email + password | User signed in | | |
| 9 | Navigate to saved jobs | Click saved jobs link | Saved jobs list loads | | |
| 10 | Verify job count | - | Same number of jobs as before | | |
| 11 | Verify job titles | - | All previously saved jobs still present | | |

**Expected Outcome:**
- Saved jobs persist after sign-out
- Saved jobs persist after browser close
- Same jobs visible after re-authentication
- No data loss

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

#### **TEST-MANUAL-015: Unauthenticated Save Attempt**

**Objective:** Verify save functionality requires authentication

**Pre-conditions:**
- User NOT signed in
- Viewing job details

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Ensure user signed out | Check navigation | "Sign In" button visible | | |
| 2 | Navigate to job details | Any job | Job details page loads | | |
| 3 | Locate save button | - | Save button not visible OR disabled | | |
| 4 | Attempt to save (if visible) | Click event | Redirected to sign-in OR error message | | |
| 5 | Verify no save occurred | - | Job not in any saved collection | | |

**Expected Outcome:**
- Save button hidden for unauthenticated users
- OR save button disabled
- OR clicking prompts to sign in
- No job saved without authentication

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

### 5.4 Chatbot Module Manual Tests

---

#### **TEST-MANUAL-016: Job Chatbot - Salary Question**

**Objective:** Verify chatbot answers salary-related questions

**Pre-conditions:**
- Viewing job details page
- Job has salary information

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to job details | Job with salary info | Job details loads | | |
| 2 | Note job salary range | - | Record: e.g., £40,000 - £50,000 | | |
| 3 | Locate chatbot widget | - | Chatbot icon visible | | |
| 4 | Open chatbot | Click chatbot icon | Chatbot window opens | | |
| 5 | Type salary question | "What is the salary?" | Message sent | | |
| 6 | Wait for response | - | Response received within 2 seconds | | |
| 7 | Verify response content | - | Response contains salary range | | |
| 8 | Verify accuracy | - | Response matches displayed salary | | |
| 9 | Verify currency | - | Response includes currency (GBP, USD) | | |

**Expected Outcome:**
- Chatbot opens successfully
- Recognizes salary question
- Responds with correct salary information
- Response within 2 seconds

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Question: "What is the salary?"
Job Salary: £40,000 - £50,000
Expected Response: "The salary range for this position is £40,000 - £50,000 per year."
```

---

#### **TEST-MANUAL-017: Job Chatbot - Location Question**

**Objective:** Verify chatbot answers location questions

**Pre-conditions:**
- Viewing job details page
- Chatbot open

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Note job location | - | Record location (e.g., "Manchester") | | |
| 2 | Type location question | "Where is this job?" | Message sent | | |
| 3 | Wait for response | - | Response within 2 seconds | | |
| 4 | Verify response content | - | Response contains location name | | |
| 5 | Verify accuracy | - | Response matches displayed location | | |

**Expected Outcome:**
- Chatbot recognizes location question
- Responds with correct location
- Response accurate and clear

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Question: "Where is this job?"
Job Location: Manchester
Expected Response: "This position is located in Manchester."
```

---

#### **TEST-MANUAL-018: Job Chatbot - Requirements Question**

**Objective:** Verify chatbot extracts requirements from job description

**Pre-conditions:**
- Viewing job details page
- Job description contains requirements

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Review job description | - | Description contains requirements section | | |
| 2 | Type requirements question | "What are the requirements?" | Message sent | | |
| 3 | Wait for response | - | Response within 2 seconds | | |
| 4 | Verify response content | - | Response contains requirements info | | |
| 5 | Verify accuracy | - | Requirements match job description | | |

**Expected Outcome:**
- Chatbot recognizes requirements question
- Extracts relevant information from description
- Response includes key qualifications

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Question: "What are the requirements?"
Expected Response: Information from job description requirements section
```

---

#### **TEST-MANUAL-019: Job Chatbot - Application Process**

**Objective:** Verify chatbot provides application instructions

**Pre-conditions:**
- Viewing job details page
- Chatbot open

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Type application question | "How do I apply?" | Message sent | | |
| 2 | Wait for response | - | Response within 2 seconds | | |
| 3 | Verify response content | - | Response mentions "Apply Now" button | | |
| 4 | Verify instructions | - | Clear instructions provided | | |

**Expected Outcome:**
- Chatbot recognizes application question
- Provides clear instructions
- Mentions Apply button or Reed redirect

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Question: "How do I apply?"
Expected Response: Instructions to click "Apply Now" button, mentions Reed platform
```

---

#### **TEST-MANUAL-020: Job Chatbot - Unrecognized Question**

**Objective:** Verify chatbot handles unrecognized questions gracefully

**Pre-conditions:**
- Viewing job details page
- Chatbot open

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Type unrelated question | "What's the weather?" | Message sent | | |
| 2 | Wait for response | - | Response within 2 seconds | | |
| 3 | Verify fallback response | - | Polite "I don't understand" type message | | |
| 4 | Verify suggestions | - | May suggest rephrasing or topic areas | | |

**Expected Outcome:**
- Chatbot responds (doesn't hang)
- Fallback message polite and helpful
- Doesn't provide incorrect information

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Question: "What's the weather?"
Expected Response: "I'm sorry, I couldn't find that information. Could you rephrase your question?"
```

---

#### **TEST-MANUAL-021: Job Chatbot - Multi-Turn Conversation**

**Objective:** Verify chatbot maintains conversation history

**Pre-conditions:**
- Viewing job details page
- Chatbot open

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Ask first question | "What is the salary?" | Response received | | |
| 2 | Verify first response visible | - | User message and bot response in chat | | |
| 3 | Ask second question | "Where is this job?" | Response received | | |
| 4 | Verify both conversations visible | - | 2 user messages, 2 bot responses shown | | |
| 5 | Scroll chat history | Scroll up | Can view previous messages | | |
| 6 | Ask third question | "What are the requirements?" | Response received | | |
| 7 | Verify all messages visible | - | 3 exchanges visible in chat window | | |

**Expected Outcome:**
- All messages remain visible
- Chat history scrollable
- New messages appear at bottom
- Conversation context maintained

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

#### **TEST-MANUAL-022: Website Chatbot - General Questions**

**Objective:** Verify website chatbot provides platform information

**Pre-conditions:**
- On homepage
- Website chatbot visible

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Locate website chatbot | - | Chatbot widget visible on homepage | | |
| 2 | Open chatbot | Click chatbot | Chatbot window opens | | |
| 3 | Ask platform question | "How do I search for jobs?" | Response received | | |
| 4 | Verify response quality | - | Clear instructions provided | | |
| 5 | Ask another question | "Do I need to sign up?" | Response received | | |
| 6 | Verify response | - | Explains sign-up benefits | | |

**Expected Outcome:**
- Website chatbot responds to general questions
- Provides helpful information about platform
- Different behavior than job chatbot

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

### 5.5 Admin Dashboard Manual Tests

---

#### **TEST-MANUAL-023: View All Users**

**Objective:** Verify admin can view all registered users

**Pre-conditions:**
- Firebase Admin SDK configured
- Admin credentials set in environment
- At least 3 users registered

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Navigate to admin dashboard | URL: /admin/dashboard | Dashboard loads | | |
| 2 | Wait for users to load | - | User list populates within 3 seconds | | |
| 3 | Verify user statistics | - | Total users count displayed | | |
| 4 | Verify verified users count | - | Verified users count shown | | |
| 5 | Verify unverified users count | - | Unverified users count shown | | |
| 6 | Check user list | - | At least 3 users in table | | |
| 7 | Verify user information | - | Each row shows: email, UID, creation date | | |
| 8 | Verify verification status | - | Email verified status visible (✓ or ✗) | | |

**Expected Outcome:**
- Dashboard loads successfully
- Statistics accurate
- All users listed
- Complete user information displayed

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Expected Users: 3+
Statistics: Total, Verified, Unverified counts
User Fields: Email, UID, Created, Verified
```

---

#### **TEST-MANUAL-024: Create New User via Admin**

**Objective:** Verify admin can create user accounts

**Pre-conditions:**
- On admin dashboard
- Firebase Admin SDK configured

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Note current user count | - | Record total users (e.g., 5) | | |
| 2 | Click "Create User" button | Click event | User creation form/modal appears | | |
| 3 | Enter email | Email: admintest001@example.com | Email input accepts value | | |
| 4 | Enter password | Password: AdminPass123 | Password input masked | | |
| 5 | Enter display name | Name: "Admin Test User" | Display name input accepts value | | |
| 6 | Check "Email Verified" | Check checkbox | Checkbox checked | | |
| 7 | Click "Create User" button | Click event | Loading indicator appears | | |
| 8 | Wait for response | - | Success message within 3 seconds | | |
| 9 | Verify success message | - | Message includes user UID | | |
| 10 | Check user list | - | New user appears in list | | |
| 11 | Verify user details | - | Email, name, verified status correct | | |
| 12 | Verify user count | - | Total users increased by 1 | | |

**Expected Outcome:**
- User created successfully
- User appears in list immediately
- All details correct
- User count updated

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Email: admintest001@example.com
Password: AdminPass123
Display Name: Admin Test User
Email Verified: true
Expected: User created in Firebase Auth
```

---

#### **TEST-MANUAL-025: Create User Validation**

**Objective:** Verify input validation for user creation

**Pre-conditions:**
- On admin dashboard
- User creation form open

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Test invalid email | Email: "notanemail" | Validation error: "Invalid email format" | | |
| 2 | Clear and enter short password | Password: "123" | Validation error: "Min 6 characters" | | |
| 3 | Test duplicate email | Email: (existing user) | Error: "Email already exists" | | |
| 4 | Test valid inputs | Email: new, Password: valid | User created successfully | | |

**Expected Outcome:**
- Email format validated
- Password length validated
- Duplicate email prevented
- Clear error messages

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Invalid Email: notanemail
Short Password: 123
Duplicate Email: (use existing user)
Valid Email: validtest@example.com
Valid Password: ValidPass123
```

---

#### **TEST-MANUAL-026: Delete User via Admin**

**Objective:** Verify admin can delete user accounts

**Pre-conditions:**
- On admin dashboard
- At least one test user exists (created in TEST-MANUAL-024)

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Note current user count | - | Record total users (e.g., 6) | | |
| 2 | Locate test user in list | Email: admintest001@example.com | User visible in list | | |
| 3 | Click "Delete" button for user | Click event | Confirmation modal appears | | |
| 4 | Verify confirmation message | - | Shows user email for confirmation | | |
| 5 | Click "Cancel" | Click event | Modal closes, user still in list | | |
| 6 | Click "Delete" button again | Click event | Confirmation modal appears again | | |
| 7 | Click "Confirm Delete" | Click event | Loading indicator appears | | |
| 8 | Wait for response | - | Success message within 2 seconds | | |
| 9 | Verify user removed | - | User no longer in list | | |
| 10 | Verify user count | - | Total users decreased by 1 | | |
| 11 | Verify in Firebase (optional) | Check Firebase Console | User UID not found | | |

**Expected Outcome:**
- Confirmation required before deletion
- User deleted successfully
- User removed from list immediately
- User count updated
- User deleted from Firebase Auth

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
User to delete: admintest001@example.com
Expected: User deleted from Firebase Auth
Expected: User list updated
```

---

#### **TEST-MANUAL-027: Admin Dashboard Pagination**

**Objective:** Verify pagination works for large user lists

**Pre-conditions:**
- More than 100 users in system (or configured page size)
- On admin dashboard

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Load admin dashboard | - | First page of users loads | | |
| 2 | Count users on page | - | Maximum 100 users (or configured limit) | | |
| 3 | Locate pagination controls | Scroll to bottom | Pagination visible | | |
| 4 | Click "Next Page" | Click event | Page 2 loads | | |
| 5 | Verify different users | - | Different users than page 1 | | |
| 6 | Click "Previous Page" | Click event | Return to page 1 | | |
| 7 | Verify same users | - | Same users as initially loaded | | |

**Expected Outcome:**
- Pagination controls visible
- Pages navigate correctly
- Each page shows different users
- User limit per page enforced

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Note:** If fewer than 100 users exist, this test can be skipped or marked as N/A.

---

### 5.6 UI/UX Manual Tests

---

#### **TEST-MANUAL-028: Responsive Design - Mobile**

**Objective:** Verify application works on mobile devices

**Pre-conditions:**
- Mobile device or browser dev tools set to mobile view
- Screen width: 375px (iPhone SE size)

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Set browser to mobile view | Viewport: 375px x 667px | Page adjusts to mobile layout | | |
| 2 | Navigate to homepage | URL: http://localhost:3000 | Homepage loads, no horizontal scroll | | |
| 3 | Check navigation | - | Hamburger menu visible, full menu hidden | | |
| 4 | Test hamburger menu | Click menu icon | Menu expands/slides in | | |
| 5 | Navigate to search | Click search in menu | Search page loads | | |
| 6 | Test search form | Enter keywords | Virtual keyboard doesn't obscure form | | |
| 7 | View search results | Submit search | Job cards stack vertically | | |
| 8 | Test job card tap | Tap job card | Job details load | | |
| 9 | Test save button | Tap save button | Button responds (not too small) | | |
| 10 | Test chatbot | Tap chatbot icon | Chatbot opens, doesn't overflow screen | | |

**Expected Outcome:**
- All content fits mobile screen
- No horizontal scrolling required
- Touch targets minimum 44px
- Forms usable with virtual keyboard
- Navigation accessible via hamburger menu

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

**Test Data:**
```
Device: iPhone SE simulation
Viewport: 375px x 667px
Min Touch Target: 44px
Expected: Full functionality on mobile
```

---

#### **TEST-MANUAL-029: Responsive Design - Tablet**

**Objective:** Verify application works on tablet devices

**Pre-conditions:**
- Browser dev tools set to tablet view
- Screen width: 768px (iPad size)

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Set browser to tablet view | Viewport: 768px x 1024px | Page adjusts to tablet layout | | |
| 2 | Navigate to homepage | - | Homepage optimally uses space | | |
| 3 | Check navigation | - | Full navigation visible OR hamburger menu | | |
| 4 | View job search results | Perform search | Jobs in 2-column grid | | |
| 5 | Test touch interactions | Tap various elements | All interactive elements respond | | |

**Expected Outcome:**
- Layout optimized for tablet
- Multi-column layouts where appropriate
- Touch-friendly interface

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

#### **TEST-MANUAL-030: Loading States**

**Objective:** Verify loading indicators display during async operations

**Pre-conditions:**
- Application running
- Throttle network to "Slow 3G" in browser dev tools

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Throttle network | Dev tools: Slow 3G | Network throttled | | |
| 2 | Perform job search | Keywords: "Developer" | Loading spinner appears immediately | | |
| 3 | Wait for results | - | Spinner visible during load | | |
| 4 | Verify spinner disappears | - | Spinner removed when results load | | |
| 5 | Click job save button | Click save | Button shows loading state | | |
| 6 | Wait for save complete | - | Loading state clears after save | | |
| 7 | Load saved jobs page | Navigate to /saved-jobs | Loading indicator shown | | |
| 8 | Sign in | Perform sign-in | Loading state on submit button | | |

**Expected Outcome:**
- Loading indicators appear for all async operations
- Indicators clear when operation completes
- User aware of system activity
- No blank/frozen states

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

#### **TEST-MANUAL-031: Error Handling Display**

**Objective:** Verify error messages display clearly

**Pre-conditions:**
- Application running

**Test Steps:**

| Step | Action | Test Input | Expected Result | Actual Result | Pass/Fail |
|------|--------|------------|-----------------|---------------|-----------|
| 1 | Trigger sign-in error | Wrong password | Error message displayed prominently | | |
| 2 | Verify error styling | - | Error in red or warning color | | |
| 3 | Verify error clarity | - | Message explains what went wrong | | |
| 4 | Trigger network error | Disconnect internet, search | Network error message shown | | |
| 5 | Verify retry option | - | Option to retry or action to take | | |
| 6 | Trigger validation error | Invalid email format | Inline validation error shown | | |

**Expected Outcome:**
- Errors displayed clearly
- Error messages helpful and specific
- Retry/resolution options provided
- Errors don't crash application

**Actual Outcome:**
- [ ] As expected
- [ ] Deviations noted: _______________________

---

## 6. Test Data Requirements

### 6.1 User Test Data

| User Type | Email | Password | Email Verified | Purpose |
|-----------|-------|----------|---------------|---------|
| **Test User 1** | testuser001@example.com | TestPass123 | true | Primary test user for feature testing |
| **Test User 2** | testuser002@example.com | TestPass456 | false | Unverified user testing |
| **Admin User** | admin@example.com | AdminPass789 | true | Admin dashboard testing |
| **Test User 3** | testuser003@example.com | TestPass321 | true | Multi-user scenarios |

### 6.2 Job Test Data

**Job fixtures should include:**
- Jobs with complete information (all fields populated)
- Jobs with missing salary information
- Jobs with missing optional fields
- Jobs in various categories
- Jobs in different locations
- Jobs with different employment types

### 6.3 Firebase Test Environment

**Firestore Collections:**
```
savedJobs/
├── [docId1] - User 1's saved job
├── [docId2] - User 1's another saved job
├── [docId3] - User 3's saved job
```

**Authentication:**
- Minimum 3 test users
- Mix of verified and unverified users
- Admin user (if roles implemented)

---

## 7. Test Coverage Summary

### 7.1 Coverage by Module

| Module | Unit Tests | Integration Tests | E2E Tests | Total Test Cases |
|--------|-----------|------------------|-----------|------------------|
| **Authentication** | 14 | 4 | 3 | 21 |
| **Saved Jobs** | 17 | 5 | 3 | 25 |
| **Job Search** | 12 | 5 | 3 | 20 |
| **API Routes** | 37 | 5 | - | 42 |
| **Chatbot** | 8 | - | 2 | 10 |
| **Admin Dashboard** | - | 4 | 3 | 7 |
| **UI Components** | 27 | - | - | 27 |
| **Responsive Design** | - | - | 2 | 2 |
| **Error Handling** | - | - | 1 | 1 |
| **TOTAL** | **115** | **23** | **17** | **155** |

### 7.2 Test Execution Status

| Test Type | Total Specified | Automated | Manual | Execution Status |
|-----------|----------------|-----------|--------|------------------|
| **Unit Tests** | 115 | 0 | 0 | Not Implemented |
| **Integration Tests** | 23 | 0 | 0 | Not Implemented |
| **E2E Tests** | 17 | 0 | 17 | Manual Scripts Provided |
| **Total** | **155** | **0** | **17** | **Documentation Complete** |

### 7.3 Priority Coverage

| Priority | Test Cases | Percentage |
|----------|-----------|------------|
| **Critical** | 87 | 56% |
| **High** | 52 | 34% |
| **Medium** | 16 | 10% |

---

## 8. Appendices

### Appendix A: Test Automation Roadmap

**Phase 1: Core Unit Tests (Weeks 1-2)**
- AuthContext tests
- SavedJobsService tests
- Basic component tests

**Phase 2: API Integration Tests (Weeks 3-4)**
- Jobs API tests
- Users API tests
- Chatbot API tests

**Phase 3: E2E Automation (Weeks 5-6)**
- Critical user journeys (auth, search, save)
- Happy path scenarios
- Error scenarios

**Phase 4: CI/CD Integration (Week 7)**
- GitHub Actions workflow
- Automated test runs on PR
- Coverage reporting

---

### Appendix B: Bug Reporting Template

When executing manual tests, use this format to report bugs:

```
Bug ID: BUG-XXX
Test ID: (e.g., TEST-MANUAL-011)
Date Found: YYYY-MM-DD
Tester: [Name]

Summary: [Brief description]

Steps to Reproduce:
1. [Step]
2. [Step]
3. [Step]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Severity: Critical / High / Medium / Low
Priority: P1 / P2 / P3

Environment:
- Browser: [Chrome 120, etc.]
- OS: [macOS, Windows, etc.]
- Screen Size: [Desktop, Mobile, etc.]

Screenshots/Videos: [Attach if available]

Additional Notes:
[Any relevant information]
```

---

### Appendix C: Test Environment Configuration

**Development Environment:**
```bash
# .env.test.local
NODE_ENV=test
FIREBASE_PROJECT_ID=hirely-test
FIREBASE_API_KEY=test_api_key
REED_API_KEY=test_reed_key_or_mock
```

**Test Scripts in package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.ts'",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

### Appendix D: Manual Test Execution Checklist

**Pre-Test Setup:**
- [ ] Application deployed and running
- [ ] Test database/environment configured
- [ ] Test user accounts created
- [ ] Test data seeded
- [ ] Browser/device ready

**During Testing:**
- [ ] Follow test steps precisely
- [ ] Record actual results
- [ ] Mark Pass/Fail for each test
- [ ] Take screenshots of failures
- [ ] Note any deviations

**Post-Test:**
- [ ] Submit test results
- [ ] Report all bugs found
- [ ] Clean up test data (if needed)
- [ ] Document any test script issues

---

### Appendix E: Success Criteria for Release

**Minimum Test Requirements for Production Release:**

1. **All Critical Tests Pass:**
   - 100% of Priority: Critical tests must pass
   - Manual execution acceptable for E2E tests

2. **Core Functionality Verified:**
   - User can sign up, sign in, sign out
   - User can search and view jobs
   - User can save and unsave jobs
   - Admin can manage users

3. **No Critical Bugs:**
   - Zero P1 (Critical) bugs open
   - No more than 5 P2 (High) bugs open

4. **Performance Criteria Met:**
   - Page load time < 3 seconds
   - API response time < 2 seconds
   - No memory leaks detected

5. **Security Checklist Complete:**
   - Authentication working correctly
   - API keys not exposed in client
   - Input validation implemented
   - Error messages don't leak sensitive info

---

**End of Test Documentation**

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-10 | Development Team | Initial test documentation created |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Development Lead | | | |
| Product Owner | | | |

---
