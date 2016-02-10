//You can view a service with "Services"

var Service = require('node-windows').Service;

var svc = new Service({
  name:'File Server',
  description: 'My file Video Server and chat',
  script: 'C:\\Users\\Clint\\workspace\\TwitterClone\\index.js'
});

svc.on('install',function(){
  svc.start();
  console.log("Success!")
});

svc.on('alreadyinstalled',function(){
  console.log("The service is already installed.")
  console.log('The service exists: ',svc.exists);
});

svc.on('invalidinstallation',function(){
  console.log("The installation is invalid.")
  console.log('The service exists: ',svc.exists);
});

svc.install();
