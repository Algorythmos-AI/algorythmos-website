# Algorythmos - AI & Data Science Consulting

A professional website for Algorythmos, showcasing AI and data science consulting services.

## Newsletter Setup

To enable the newsletter subscription functionality in the footer, you need to configure Mailchimp API credentials:

### 1. Get Mailchimp API Credentials

1. **API Key**: Go to your Mailchimp account → Account → Extras → API Keys → Create A Key
2. **List ID**: Go to Audience → Settings → Audience name and defaults → Copy the Audience ID
3. **Server Prefix**: The part after the dash in your API key (e.g., "us1", "us2", etc.)

### 2. Environment Variables

Create a `.env` file in the root directory with:

```env
REACT_APP_MAILCHIMP_API_KEY=your_mailchimp_api_key_here
REACT_APP_MAILCHIMP_LIST_ID=your_audience_list_id_here
REACT_APP_MAILCHIMP_SERVER_PREFIX=us1
```

### 3. Features

- **Newsletter Subscription**: Functional form with Mailchimp integration
- **Success/Error Messages**: Clear feedback for users
- **Loading States**: Spinner animation during submission
- **Responsive Design**: Works on all devices
- **Duplicate Handling**: Gracefully handles already subscribed emails

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
