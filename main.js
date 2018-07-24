// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const os = require('os')
const menu = new Menu()

// THe 'config' JSON store is responsible for keeping track of the mailbox configuration.
// Its only key is "active" which can either hold the value of "yes" or "no". 
const Store = require('electron-store')
const config = new Store()
const creds = new Store()
 
keytar = require('keytar')

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
  mainWindow.webContents.on('did-finish-load',() => {
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
    config.set('active','yes')
    creds.set('server',owau)
    creds.set('domain',edom)
    creds.set('useremailaddress',email)
    creds.set('username',uname)
    keytar.setPassword('vision', creds.get('username'), pass)
    app.relaunch() // opens a new Vision Client instance
    app.quit()     // kills the old (setup.html) instance
  })
}

ipcMain.on('loggin-in', (event) => {  
  // Send value synchronously back to renderer process
  const vault = keytar.getPassword('vision', creds.get('username'))
  vault.then((pass) => {
    var loginset = {
      server: creds.get('server'),
      domain: creds.get('domain'),
      useremailaddress: creds.get('useremailaddress'),
      username: creds.get('username'),
      password: pass
    }
    console.log(loginset)
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
            creds.delete('server')
            creds.delete('domain')
            creds.delete('useremailaddress')
            keytar.deletePassword('vision', creds.get('username'))
            creds.delete('username')
            config.set('active','no')  // this resets the app
            app.relaunch()             // opens a new Vision Client instance
            app.quit()                 // kills the old instance
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
    }, { role: 'help',
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
