const ipcRenderer = require('electron').ipcRenderer;

// Gathers the user input from the form on the setup.html and saves them
// using the saveCreds function.
function saveCreds(event) {
    event.preventDefault() // stop the form from submitting
    //var email = document.getElementById("uname").value
    //var owau = document.getElementById("owau").value
    //var pass = document.getElementById("pass").value
    //var pos = email.lastIndexOf("@") //gets location of @ in the email address
    //var uname = str.slice(0,pos) //gets email username from email address (pre-@)
    //var edom = str.slice(pos+1)  //gets email domain from email address (post-@)
    //console.log(email, owau, pass, uname, edom)
    ipcRenderer.send('creds', 
        document.getElementById("owau").value, 
        //document.getElementById("edom").value, 
        document.getElementById("uname").value, 
        document.getElementById("pass").value)
        //document.getElementById("uname").value + "@" + document.getElementById("edom").value)
        //owau, 
        //edom, 
        //uname, 
        //pass,
        //email)
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
