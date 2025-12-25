@echo off
title WhatsApp Yılbaşı Otomasyon Setup
color 0A

echo ===============================
echo WhatsApp Yilbasi Otomasyon Kurulumu
echo ===============================

:: 1) Paketleri yükle
echo.
echo [1/3] whatsapp-web.js yukleniyor...
npm install whatsapp-web.js

echo.
echo [2/3] qrcode-terminal yukleniyor...
npm install qrcode-terminal

echo.
echo [3/3] chalk@4 yukleniyor...
npm install chalk@4

echo.
echo Tüm paketler yüklendi ✅

:: 2) Kullanıcıya bilgi
echo.
echo contacts.json ve config.json dosyalarini kontrol edin.
echo myNumber ve contacts bilgileri dogru olmalidir.
echo.

pause

:: 3) Scripti çalıştır
echo Node.js scripti baslatiliyor...
node index.js

pause
