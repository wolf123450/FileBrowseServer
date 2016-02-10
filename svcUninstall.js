var Service = require('node-windows').Service;

 // Create a new service object
 var svc = new Service({
   name:'File Server',
   description: 'My file Video Server and chat',
   script: 'C:\\Users\\Clint\\workspace\\TwitterClone\\index.js'
 });

 // Listen for the "uninstall" event so we know when it's done.
 svc.on('uninstall',function(){
   console.log('Uninstall complete.');
   console.log('The service exists: ',svc.exists);
 });

 // Uninstall the service.
 svc.uninstall();
