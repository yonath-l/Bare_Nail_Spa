@echo off
title Bare Nail Spa Atelier — Port 5173
cls
echo ====================================================================
echo   BARE NAIL SPA ATELIER ^& INTERACTIVE DOPAMINE LOYALTY PLATFORM
echo   Location: 411/E Athurugiriya Rd, Malabe 10115, Sri Lanka
echo ====================================================================
echo.
echo   [1] Local Boutique:    http://localhost:5173/
echo   [2] VIP Loyalty Pass:  http://localhost:5173/loyalty
echo   [3] Physical NFC Tap:  http://localhost:5173/loyalty?stamp_key=ATELIER_STAMP_2026
echo   [4] Reservation Desk:  http://localhost:5173/book
echo   [5] Reception POS CMS: http://localhost:5173/admin (Passphrase: atelier2026)
echo.
echo   Starting preview server on port 5173...
echo ====================================================================
call npx vite preview --port 5173 --host
pause
