# Deployment Instructions

**Yes, you should commit and push all of these files to your GitHub repository.**

Based on the URL you provided (`https://kind-plant-0c316ce0f.7.azurestaticapps.net/`), your frontend is hosted using **Azure Static Web Apps**. Azure Static Web Apps is designed to work seamlessly with GitHub.

### How to deploy:

1. **Push to GitHub:**
   Add all the generated files (`index.html`, `index.tsx`, `App.tsx`, `types.ts`, `constants.ts`, and the `components/` and `services/` folders) to your local Git repository, commit them, and push them to your GitHub repository.

2. **Automatic Deployment:**
   Since your Azure Static Web App is already linked to your GitHub repository, pushing these changes to your main branch will automatically trigger a GitHub Actions workflow. This workflow will deploy the new files to your `azurestaticapps.net` URL.

### ⚠️ Important Security Note regarding the API Key:

The `services/geminiService.ts` file uses `process.env.API_KEY` to authenticate with Vertex AI. 

* **DO NOT** hardcode your actual API key directly into the source code before pushing to GitHub, especially if your repository is public.
* **Configuration:** You need to configure this environment variable in your hosting environment. Go to the **Azure Portal**, navigate to your Static Web App, and look for **Environment variables** (or Configuration). Add a new variable named `API_KEY` and set its value to your Vertex AI API key.
* **Note on Browser Execution:** Because this specific setup uses native ES modules directly in the browser (via `importmap`) without a bundler like Vite or Webpack, `process.env` does not natively exist in the browser. To make this work in production on Azure, you will either need to:
  1. Add a simple build step (like Vite) to your GitHub Actions workflow that replaces `process.env.API_KEY` with the actual environment variable during the build process.
  2. Or, use Azure Static Web Apps' built-in managed functions (API backend) to securely make the call to Vertex AI, keeping the API key completely hidden from the frontend browser code.

### Firebase Configuration:
Your Firebase configuration in `constants.ts` is safe to push to GitHub. Firebase API keys are designed to be public. However, you **must** ensure that your Firebase Security Rules (in the Firebase Console) are properly set up to prevent unauthorized users from reading or writing to your database and storage buckets.
