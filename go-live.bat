@echo off
echo ==========================================
echo      GLENWOOD SITE - GOING LIVE!
echo ==========================================
echo.

:: 1. Start Python Server in a new minimized window
echo [1/3] Starting Local Server...
start /min "Glenwood Server" python -m http.server 8000

:: 2. Start Ngrok in a new window (so you can see the URL)
echo [2/3] Starting Internet Tunnel (Ngrok)...
start "Glenwood Tunnel" ngrok http 8000

:: 3. Wait 2 seconds for server to warm up
timeout /t 2 /nobreak >nul

:: 4. Open Localhost in Browser
echo [3/3] Opening Browser...
start http://localhost:8000

echo.
echo DONE! 
echo - Your local site is open in the browser.
echo - Look at the 'Glenwood Tunnel' window for your public sharing link.
echo.
pause
