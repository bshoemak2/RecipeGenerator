@ECHO off
ECHO Starting Flask backend...
if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set %%a=%%b
        echo Setting %%a=%%b
    )
)
start cmd /k "python app.py & echo Waiting for Flask to start... & timeout /t 5 & echo Flask should be running now"
ECHO Starting Expo frontend...
npx expo start --web --clear