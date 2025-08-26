# GitHub Secrets Configuration

This document describes the secrets that need to be configured in the GitHub repository for the CI/CD pipelines to work properly.

## Required Secrets

### NPM Publishing

#### `NPM_TOKEN`

- **Description**: NPM authentication token for publishing packages
- **Required for**: Manual deployment workflow
- **How to obtain**:
  1. Log in to [npmjs.com](https://www.npmjs.com/)
  2. Go to Access Tokens in your account settings
  3. Generate a new token with "Automation" type
  4. Copy the token value

**Setting up the secret:**

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your NPM token

### GitHub Packages (Optional)

#### `GITHUB_TOKEN`

- **Description**: GitHub token for publishing to GitHub Packages
- **Required for**: Publishing to GitHub Package Registry
- **Note**: This is automatically provided by GitHub Actions, no manual setup required

## Environment Configuration

### NPM Production Environment

For additional security, you can set up an environment protection rule:

1. Go to Settings → Environments
2. Create a new environment named `npm-production`
3. Add protection rules:
   - Required reviewers (recommended)
   - Wait timer (optional)
   - Deployment branches (restrict to main/release branches)

## Verification

To verify that secrets are properly configured:

1. Check that `NPM_TOKEN` appears in your repository secrets
2. Run a test deployment workflow
3. Monitor the workflow logs for authentication issues

## Security Best Practices

- **Rotate tokens regularly**: Update NPM tokens every 6-12 months
- **Use minimal permissions**: NPM tokens should only have publish permissions
- **Monitor usage**: Review NPM token usage in your NPM account
- **Environment protection**: Use GitHub environments for production deployments

## Troubleshooting

### Common Issues

1. **NPM authentication failed**
   - Verify the NPM_TOKEN secret is set correctly
   - Check that the token hasn't expired
   - Ensure the token has publish permissions

2. **GitHub Packages authentication failed**
   - Verify the workflow has `packages: write` permission
   - Check that the GITHUB_TOKEN is being used correctly

3. **Environment not found**
   - Ensure the `npm-production` environment is created
   - Check environment protection rules

### Testing Secrets

You can test your NPM token locally:

```bash
# Set the token temporarily
export NPM_TOKEN="your-token-here"

# Test authentication
npm whoami --registry https://registry.npmjs.org

# Test publish (dry run)
npm publish --dry-run --access public
```

## Contact

If you need help setting up secrets or environments, contact the DevOps team or repository maintainers.
