@echo ---------------------------------------------------------------
@echo	                 Build Hotspot
@echo ---------------------------------------------------------------
echo off
netsh wlan stop hostednetwork
netsh wlan set hostednetwork mode=allow ssid=IAMSUNSHOW-FE key=qwertyuiop
netsh wlan start hostednetwork
echo off
pause