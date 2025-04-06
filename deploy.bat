@ECHO off
ECHO Starting deployment process for Expo web app...

ECHO Checking Git repository status...
IF NOT EXIST .git (
    ECHO Git repository not found. Initializing...
    git init
    git remote add origin https://github.com/bshoemak2/RecipeGenerator.git || (
        ECHO Failed to set remote. Check if origin exists or update URL.
        ECHO Current remotes:
        git remote -v
        pause
        exit /b 1
    )
)

ECHO Verifying Git remote...
git remote -v
IF %ERRORLEVEL% NEQ 0 (
    ECHO Git remote check failed. Ensure Git is installed and configured.
    pause
    exit /b 1
)

ECHO Building Expo web app...
ECHO Running 'npx expo export --platform web' with timeout...
ECHO This may take a few moments. Logs will be saved to deploy_log.txt...
start /wait cmd /c "npx expo export --platform web > deploy_log.txt 2>&1"
IF %ERRORLEVEL% NEQ 0 (
    ECHO Expo web build failed. Check deploy_log.txt for details:
    type deploy_log.txt
    ECHO Run 'npx expo export --platform web' manually to debug.
    pause
    exit /b 1
)
ECHO Expo web build completed.
type deploy_log.txt | findstr "Exported: dist" >nul && (
    ECHO Confirmed: dist folder exported successfully.
) || (
    ECHO Warning: 'Exported: dist' not found in logs. Check deploy_log.txt:
    type deploy_log.txt
    pause
    exit /b 1
)

ECHO Adding files to Git...
ECHO Staging all tracked and untracked files...
git add .
IF %ERRORLEVEL% NEQ 0 (
    ECHO Git add failed. Check Git status:
    git status
    pause
    exit /b 1
)
ECHO Specifically adding key directories and files...
git add dist app/(tabs)/*.ts app/(tabs)/*.tsx *.py requirements.txt package.json deploy.bat start-local.bat database.py helpers.py recipe_generator.py recipes.db app.json assets/favicon.png || (
    ECHO Warning: Some files may not exist. Continuing...
)

ECHO Committing changes...
git status
git commit -m "Deploy production Expo web app" || (
    ECHO No changes to commit. Forcing an empty commit...
    git commit -m "Deploy production Expo web app (forced)" --allow-empty
)
IF %ERRORLEVEL% NEQ 0 (
    ECHO Git commit failed. Check Git status:
    git status
    pause
    exit /b 1
)

ECHO Pushing to GitHub...
git push origin main
IF %ERRORLEVEL% NEQ 0 (
    ECHO Git push failed. Check network, credentials, or remote:
    git remote -v
    ECHO Try running 'git push origin main' manually.
    pause
    exit /b 1
)

ECHO Deployment successful! Check Render for the updated web app.
ECHO URL: https://recipegenerator-