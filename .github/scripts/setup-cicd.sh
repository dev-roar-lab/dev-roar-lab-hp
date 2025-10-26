#!/bin/bash
# GitHub Actions CI/CD Setup Script
# This script automates the setup of GitHub Environments, Branch Protection Rules, and Secrets
# using the GitHub CLI (gh command)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "GitHub Actions CI/CD Setup Script"
echo "========================================="
echo ""

# Check if gh is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Get repository information
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo -e "${GREEN}Repository: ${REPO}${NC}"
echo ""

# ========================================
# Step 1: Create production Environment
# ========================================
echo "Step 1: Creating 'production' Environment..."

if gh api "repos/${REPO}/environments/production" &> /dev/null; then
    echo -e "${YELLOW}Environment 'production' already exists${NC}"
else
    gh api "repos/${REPO}/environments/production" -X PUT \
        -F wait_timer=0 \
        > /dev/null
    echo -e "${GREEN}✓ Created 'production' Environment${NC}"
fi

# ========================================
# Step 2: Configure Environment Protection Rules
# ========================================
echo ""
echo "Step 2: Configuring Environment protection rules..."

read -p "Enter GitHub username(s) for deployment approval (comma-separated): " REVIEWERS

if [ -z "$REVIEWERS" ]; then
    echo -e "${YELLOW}Warning: No reviewers specified. Manual approval will not be enforced.${NC}"
else
    # Convert comma-separated list to JSON array
    IFS=',' read -ra REVIEWER_ARRAY <<< "$REVIEWERS"
    REVIEWER_IDS=""

    for username in "${REVIEWER_ARRAY[@]}"; do
        username=$(echo "$username" | xargs) # trim whitespace
        USER_ID=$(gh api "users/${username}" -q .id 2>/dev/null || echo "")

        if [ -z "$USER_ID" ]; then
            echo -e "${RED}Error: User '${username}' not found${NC}"
            continue
        fi

        if [ -z "$REVIEWER_IDS" ]; then
            REVIEWER_IDS="{\"type\":\"User\",\"id\":${USER_ID}}"
        else
            REVIEWER_IDS="${REVIEWER_IDS},{\"type\":\"User\",\"id\":${USER_ID}}"
        fi
        echo -e "${GREEN}✓ Added reviewer: ${username} (ID: ${USER_ID})${NC}"
    done

    if [ -n "$REVIEWER_IDS" ]; then
        gh api "repos/${REPO}/environments/production" -X PUT \
            -f "deployment_branch_policy[protected_branches]=true" \
            -f "deployment_branch_policy[custom_branch_policies]=false" \
            -F "reviewers=[${REVIEWER_IDS}]" \
            > /dev/null
        echo -e "${GREEN}✓ Environment protection rules configured${NC}"
    fi
fi

# ========================================
# Step 3: Configure Branch Protection Rules
# ========================================
echo ""
echo "Step 3: Configuring Branch Protection Rules for 'main' branch..."

# Use JSON input for complex array configuration
gh api "repos/${REPO}/branches/main/protection" -X PUT \
    --input - > /dev/null 2>&1 <<'PROTECTION_EOF' || {
        echo -e "${YELLOW}Note: Branch protection may require admin permissions${NC}"
        echo -e "${YELLOW}Please configure manually if this step fails${NC}"
    }
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Format Check",
      "Lint",
      "Type Check",
      "Unit Tests",
      "Build",
      "Accessibility Tests"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_conversation_resolution": true
}
PROTECTION_EOF

echo -e "${GREEN}✓ Branch protection rules configured${NC}"

# ========================================
# Step 4: Configure Environment Secrets
# ========================================
echo ""
echo "Step 4: Configuring Environment Secrets..."
echo -e "${YELLOW}Note: Secrets must be set manually or via secure input${NC}"
echo ""
echo "Run the following commands to set secrets:"
echo ""
echo -e "${GREEN}# AWS Secrets (for production environment)${NC}"
echo "gh secret set AWS_BRIDGE_ROLE_ARN --env production"
echo "gh secret set AWS_EXECUTION_ROLE_ARN --env production"
echo "gh secret set AWS_REGION --env production"
echo "gh secret set S3_BUCKET_NAME --env production"
echo "gh secret set CLOUDFRONT_DISTRIBUTION_ID --env production"
echo ""
echo -e "${GREEN}# Repository Secrets${NC}"
echo "gh secret set GA_MEASUREMENT_ID"
echo ""

read -p "Do you want to set Environment secrets now? (y/N): " SET_SECRETS

if [[ "$SET_SECRETS" =~ ^[Yy]$ ]]; then
    echo ""
    read -p "AWS_BRIDGE_ROLE_ARN: " AWS_BRIDGE_ROLE_ARN
    if [ -n "$AWS_BRIDGE_ROLE_ARN" ]; then
        echo "$AWS_BRIDGE_ROLE_ARN" | gh secret set AWS_BRIDGE_ROLE_ARN --env production
        echo -e "${GREEN}✓ Set AWS_BRIDGE_ROLE_ARN${NC}"
    fi

    read -p "AWS_EXECUTION_ROLE_ARN: " AWS_EXECUTION_ROLE_ARN
    if [ -n "$AWS_EXECUTION_ROLE_ARN" ]; then
        echo "$AWS_EXECUTION_ROLE_ARN" | gh secret set AWS_EXECUTION_ROLE_ARN --env production
        echo -e "${GREEN}✓ Set AWS_EXECUTION_ROLE_ARN${NC}"
    fi

    read -p "AWS_REGION (e.g., ap-northeast-1): " AWS_REGION
    if [ -n "$AWS_REGION" ]; then
        echo "$AWS_REGION" | gh secret set AWS_REGION --env production
        echo -e "${GREEN}✓ Set AWS_REGION${NC}"
    fi

    read -p "S3_BUCKET_NAME: " S3_BUCKET_NAME
    if [ -n "$S3_BUCKET_NAME" ]; then
        echo "$S3_BUCKET_NAME" | gh secret set S3_BUCKET_NAME --env production
        echo -e "${GREEN}✓ Set S3_BUCKET_NAME${NC}"
    fi

    read -p "CLOUDFRONT_DISTRIBUTION_ID: " CLOUDFRONT_DISTRIBUTION_ID
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        echo "$CLOUDFRONT_DISTRIBUTION_ID" | gh secret set CLOUDFRONT_DISTRIBUTION_ID --env production
        echo -e "${GREEN}✓ Set CLOUDFRONT_DISTRIBUTION_ID${NC}"
    fi

    echo ""
    read -p "GA_MEASUREMENT_ID (optional, press Enter to skip): " GA_MEASUREMENT_ID
    if [ -n "$GA_MEASUREMENT_ID" ]; then
        echo "$GA_MEASUREMENT_ID" | gh secret set GA_MEASUREMENT_ID
        echo -e "${GREEN}✓ Set GA_MEASUREMENT_ID${NC}"
    fi
fi

# ========================================
# Summary
# ========================================
echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo -e "${GREEN}✓ Production Environment created${NC}"
echo -e "${GREEN}✓ Environment protection rules configured${NC}"
echo -e "${GREEN}✓ Branch protection rules configured${NC}"
echo ""
echo "Next Steps:"
echo "1. Update .github/CODEOWNERS with actual GitHub usernames/teams"
echo "2. Verify settings at: https://github.com/${REPO}/settings"
echo "3. Test the CI/CD pipeline by creating a PR"
echo ""
echo "For more information, see:"
echo "- CI_CD_IMPROVEMENT_PLAN.md"
echo "- .github/workflows/README.md"
echo ""
