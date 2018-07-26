# Vision Client for MicroSoft Exchange OWA

**Clone and run for a quick way to use Exchange OWA on your desktop.**

This is a minimal Electron app for using the Exchange OWA. Useful for people tired of using regular OWA and/or locked out of IMAP/desktop email clients/etc.



## To Install & Run

**Windows** 

Download the vision.exe from the "/dist/windows" folder and run it as an administrator. After a quick installation process, your Vision Client should be ready to go.

**Linux**

Download the "vision.AppImage" from the "/dist/linux" folder and run it as an executable (please run >terminal: chmod +x .\vision.AppImage if the file won't be discovered by the system as an executable automatically). Running this file will create a .desktop file which you can later use from app launcher, dock etc.
If you're running a Debian (.deb) based distro, you can also install the "vision.deb" file, which is located in "/dist/linux" as well.



## To Run (from source)

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



## Resetting, Refreshing & Troubleshooting

**Reset Credentials (change account)**

To change the account logged into the Vision Client, open-up the "File" menu and select "Reset Login Credentials" - the app will restart and launch the setup wizard.

**Refresh the Client (if the connection times out or you get logged out of OWA)**

To refresh Vision Client without closing it down and launching it again manually, open up the "File" menu and select "Re-login to the OWA" - the app will re-open with your account logged back in.

**Login Problems**

If you encounter any issues with logging in (i.e. "bad password" error), please do check your OS keyring application:
- Windows: Credentials Manager
- Linux: Gnome Kyring/Seahorse/etc.
- macOS: Keyring
Your user credentials should be saved under "vision" service - before raising an issue here, please check if everything seems ok in there.

**Stuck loading screen**

Stuck loading screen might indicate one of two things:
1) no WAN connection or blocked outgoing connections to your Exchange OWA address over port 443 - please check your Internet connection and the firewall rules in your network (if possible), before raising an issue
2) wrong server details (username, server URL, domain) - please use the "File->Reset Login Credentials" option and double check if the entered information is correct:
- username - this should be your AD login without a domain (i.e. john.doe instead of domain\john.doe or john.doe@domain.local)
- domain - this should be ony the top-level domain of your Exchange server (i.e. example.com instead of webmail.example.com)
- server URL - this option should be typed in without any protocols or sub-directories specified (i.e. webmail.example.com instead of https://webmail.example.com/owa) 

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
