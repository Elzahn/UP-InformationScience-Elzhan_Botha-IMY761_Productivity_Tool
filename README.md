# UP-InformationScience-Elzhan_Botha-IMY761_Productivity_Tool
University of Pretoria Honours IMY 761 Productivity tool

This is a productivity tool created for my honours project for IMY 76
.
The program is in the bundled folder, to use just download the folder
corresponding to your computer architecture, extract the zip file and execute the exe file found
inside the folder.

To recompile the code into an application, download the code, run npm install
and run the following commands.

- npm i electron-packager -g
- electron-packager <dir> <app_name> --platform=win32 --arch=all

<dir> replace this with the path to your app folder.
<app_name> this is the name of your app.
--platform=win32 you can build for all platforms, but I only run Windows at the moment so that is all I built for. This is required.
--arch=all you can choose to build for 32 bit or 64 bit or both. I just went with all.
