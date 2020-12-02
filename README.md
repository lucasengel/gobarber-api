# GoBarber API

## App Routes

### POST /password/forgot

Sends a reset token to the provided email.

Request body:

```json
{
  email: john@got.com
}
```

### POST /password/reset

Saves the a new password given a token within expiration time:

Request body:

```json
{
  "password": "123456",
  "password_confirmation": "123456",
  "token": "d7bfbd05-af6e-4717-bcbb-aefde5cdc1d0"
}
```

### GET /appointments/schedule

Returns provider's own daily scheduled given these parameters:

- year=YYYY
- month=MM
- day=DD

eg. `/appointments/schedule?year=2020&month=01&day=01`

Bearer token required

### GET /profile

Returns provider's own profile.

Bearer token required

### POST /sessions

Authenticates users.

Request body:

```json
{
  "email": "arya@got.com",
  "password": "123456"
}
```

### POST /users

Registers a new user.

Request body:

```json
{
  "name": "Rob Stark",
  "email": "rob@got.com",
  "password": "123456"
}
```

### PATCH /users/avatar

Updates own avatar given a file.

Multipart/form-data:

```
  avatar: file
```

Bearer token required

### PUT /profile

Updates own profile data.

Request body:

```json
{
  "name": "Ned Stark",
  "email": "ned@got.com",
  "old_password": "abcdef",
  "password": "123456",
  "password_confirmation": "123456"
}
```

Bearer token required

### POST /appointments

Creates an appointment given a `provider_id` and a timestamp.

```json
{
  "provider_id": "uuid",
  "date": "2020-01-01 09:00:00"
}
```

Bearer token required

### GET /providers

Returns a list of registered providers.

Bearer token required

### GET /providers/:provider/month-availability

Returns the availability by day for a provider

- year=YYYY
- month=MM

eg. `/providers/:provider_id/month-availability?year=2020&month=01`

Bearer token required

### GET /providers/:provider/day-availability

Returns the availability by hour for a provider

- year=YYYY
- month=MM
- day=DD

eg. `/providers/:provider_id/day-availability?year=2020&month=01&day=01`

Bearer token required
