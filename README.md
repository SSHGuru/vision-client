# Vision Client for MicroSoft Exchange OWA

**Clone and run for a quick way to use Exchange OWA on your desktop.**

This is a minimal Electron app for using the Exchange OWA. Useful for people tired of using regular OWA and/or locked out of IMAP/desktop email clients/etc.



## To Use

Windows: 
Download the vision.exe from the "~/dist/windows" folder and run it as an administrator. After a quick installation process, your Vision Client should be ready to go.

Linux:
Download the "vision.AppImage" from the "~/dist/linux" folder and run it as an executable (please run >terminal: chmod +x .\vision.AppImage if the file won't be discovered by the system as an executable automatically). Running this file will create a .desktop file which you can later use from app launcher, dock etc.
If you're running a Debian (.deb) based distro, you can also install the "vision.deb" file, which is located in "~/dist/linux" as well.

## To Use (from source)

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/vlku-admin/vision-client
# Go into the repository
cd vision-client
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.



## License

[CC0 1.0 (Public Domain)](LICENSE.md)
