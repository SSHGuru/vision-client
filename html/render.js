const ipcRenderer = require('electron').ipcRenderer;
const os = require('os')
 
// Used for accessing the keychain native to the OS.
const keytar = require('keytar')

// The "creds" JSON store is responsibile for keeping track of all the
// end-user credentials. This is NOT what will be the case in the final
// version, as this solution has a major security flaw (plaintext password).
// To be replaced with keytar password management system.
const Store = require('electron-store')
const creds = new Store()

// Adds the login information gathered from the user to JSON store "creds".
// Username and password are getting saved to keychain native to the OS.
function saveCreds (owau,edom,uname,pass,email) {
    //creds.set('server',owau)
    //creds.set('domain',edom)
    //creds.set('useremailaddress',email)
    //creds.set('username',uname)
    //keytar.setPassword('vision', creds.get('username'), pass)
    //creds.set('password',pass)
    // Sends an event notification to main.js, 
    // so the windows actions can be carried out.
    ipcRenderer.send('creds', owau, edom, uname, pass, email)
}

// Deletes everything from the "creds" JSON store and deletes the credentials
// for "visionclient" service, effectively resetting the email account setup.
function delCreds () {
    creds.delete('server')
    creds.delete('domain')
    creds.delete('useremailaddress')
    creds.delete('username')
    keytar.deletePassword('vision', uname)
    //creds.delete('password')
}

// Gathers the user input from the form on the setup.html and saves them
// using the saveCreds function.
function sendForm(event) {
    event.preventDefault() // stop the form from submitting
    let uname = document.getElementById("uname").value;
    let pass = document.getElementById("pass").value;
    let edom = document.getElementById("edom").value;
    let owau = document.getElementById("owau").value;
    let email = uname + "@" + edom;
    saveCreds(owau,edom,uname,pass,email)
}

// Reduntant. To be deleted in the next code clean-up.
function eraseForm(event) {
    event.preventDefault() // stop the form from submitting
    delCreds()
}

// Uses the informations stored in the "creds" JSON store to atomatically
// log in the user to the Exchange server.
function Login(){
    var loginset = ipcRenderer.sendSync('loggin-in')

    var server = loginset.server
    var domain = loginset.domain
    var useremailaddress = loginset.useremailaddress
    var username = loginset.username
    var password = loginset.password

    // Creates logon URL string for the server supplied by the user.
    var url = "https://" + server + "/owa/" + useremailaddress + "/auth/owaauth.dll"; 
    var p = {destination:'https://' + server + '/owa/#path=/mail',flags:'0',forcedownlevel:'0',trusted:'0',isutf8:'1',username:domain + '\\' + username,password:password};

    // Creates form for the login credentials.
    var myForm = document.createElement("form");
    myForm.method="post" ;
    myForm.action = url ;
    for (var k in p) {
        var myInput = document.createElement("input") ;
        myInput.setAttribute("name", k) ;
        myInput.setAttribute("value", p[k]);
        myForm.appendChild(myInput) ;
    }

    // Finalizes the logon and cleans up.
    document.body.appendChild(myForm) ;
    myForm.submit() ;
    document.body.removeChild(myForm) ;
}
