// Modules to control application life and create native browser window.
// The 'keytar' module is required for getting access to the OS keychain system.
// The user's OWA password is getting saved into the keychain and thus secured 
// outside of the Vision Client.
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const Store = require('electron-store')
const keytar = require('keytar')

// The 'config' JSON store is responsible for keeping track of the mailbox configuration.
const config = new Store()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create new window with default resolution
  mainWindow = new BrowserWindow({width: 1280, height: 800})

  // If this is the first time running the app or the "reset credentials" 
  // command was selected during the previous run, start the Vision Client
  // in lower resolution and launch the initial setup wizard (setup.html).
  if (config.get('active') != 'yes'){
    mainWindow.setSize(900,700)
    mainWindow.setAutoHideMenuBar(true)
    mainWindow.setMenu(null)
    mainWindow.loadFile('html/setup.html')
  } else {
    // In all other cases, start the default email page (index.html).
    mainWindow.loadFile('html/index.html')
  }

  // Changes the top bar to 'Vision OWA Client' and ensures it stays that way.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle("Vision OWA Client");
  })

  // Forces OWA to work as under Windows (OWA won't work under Linux/Chrome combo).
  // The following sets the browser useragent string to Firefox running on Windows.
  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0')

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // When a 'creds-submitted' event is received from renderer.js (which means the 
  // login details for the account have been succesfully saved), the "active" flag
  // gets changed to "yes" so the app will skip initial wizard setup page (setup.html).
  // The Vision Client then restarts using the new settings.
  ipcMain.on('creds', function (event, owau, edom, uname, pass, email) {
    config.set('active', 'yes')
    config.set('server', owau)
    config.set('domain', edom)
    config.set('useremailaddress', email)
    config.set('username', uname)
    keytar.setPassword('vision', uname, pass)
    app.relaunch() // opens a new Vision Client instance
    app.quit()     // kills the old (setup.html) instance
  })
}

// This function sens the user credentials and congfig to 'render.js' process.
// The user password is retrieved using keytar from the OS keychain system.
ipcMain.on('loggin-in', (event) => {  
  // Send value synchronously back to renderer process.
  const vault = keytar.getPassword('vision', config.get('username'))
  vault.then((pass) => {
    var loginset = {
      server: config.get('server'),
      domain: config.get('domain'),
      useremailaddress: config.get('useremailaddress'),
      username: config.get('username'),
      password: pass
    }
    // Uncomment the below for troubleshooting.
    //console.log(loginset)
    event.returnValue = loginset
  })
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow()
  
  // Custom top menu template (adds the 'Reset Login Credentials' option to File sub-menu).
  const menuTemplate = [
    {
      label: 'File',
      submenu: [{ 
          label: 'Reset Login Credentials', click: () => {
            config.delete('server')
            config.delete('domain')
            config.delete('useremailaddress')
            keytar.deletePassword('vision', "paul.wilk")
            config.delete('username')
            config.set('active','no')  // this resets the app & forces it to launch the setup wizard
            app.relaunch()             // opens a new Vision Client instance window (w/ wizard)
            app.quit()                 // kills the old instance thus clearing the old credentials
          }
        }, { label: 'Re-login to the OWA', click: () => {
            app.relaunch()
            app.quit()
          }
        }, { type: 'separator'
        }, { label: 'Quit Vision OWA Client', click: () => {
            app.quit();
          }
        }]
    }, { label: 'Edit',
      submenu: [ {role: 'undo'},{role: 'redo'},{type: 'separator'},{role: 'cut'},{role: 'copy'},
                {role: 'paste'},{role: 'pasteandmatchstyle'},{role: 'delete'},{role: 'selectall'}]
    }, { label: 'View',
      submenu: [{role: 'reload'},{role: 'forcereload'},{role: 'toggledevtools'},{type: 'separator'},
                {role: 'resetzoom'},{role: 'zoomin'},{role: 'zoomout'},{type: 'separator'},{role: 'togglefullscreen'}]
    }, { role: 'window',
      submenu: [{role: 'minimize'},{role: 'close'}]
    }, { role: 'Help',
      submenu: [{label: 'Learn More',click () { require('electron').shell.openExternal('https://electronjs.org') }}]
    }
  ]

  // Initializes the menu object using the above tenplate.
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
