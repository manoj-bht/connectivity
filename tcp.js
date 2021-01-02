var modbus = require("modbus-stream");

modbus.tcp.server({debug: "server"}, (connection) => {
    console.log('connected');
    setInterval(function(){ 
//    setTimeout(function(){ 
        console.log(1);
        readWrite(); 
    }, 10000);
    
    function readWrite(){
        connection.readHoldingRegisters({address: 6126, quantity: 1, extra: {unitId: 1, retry: 3000}}, (err, info) => {
        if (err)
            console.log(err);
        console.log('response');
        console.log(info);
        if (info && info.response) {
            console.log("response", info.response.data);
            console.log(info.response.data[0].readInt16BE(0));
            let one_hundred = Buffer.alloc(2);
            one_hundred.writeUInt16BE(20, 0);
            connection.writeSingleRegister({address: 6127, value: one_hundred,extra: { unitId: 1,retry:3000 }}, (err, data) => {
                if (err)
                    console.log(err);
                console.log('response', data);
            });
//            let one_hundred  = Buffer.alloc(2);
//            one_hundred.writeUInt16BE(100, 0);
//            connection.writeMultipleRegisters({address:6127, values:[one_hundred],extra: { unitId: 2,retry:3000 }}, (err, data) => {
//                if(err) console.log(err);
//                console.log('response',data);
//            });
        }
    });
    }
    

}).listen(1025, () => {
    console.log('server is running on 1025')
});









//modbus.tcp.server("/dev/ttyS123", {
//    // except "debug", everything else is the default for serial
//    baudRate : 9600,
//    dataBits : 8,
//    stopBits : 1,
//    parity   : "even"
////    debug    : "automaton-123"
//}, (err, connection) => {
//    if (err) throw err;
//
//        connection.readHoldingRegisters({address: 6126, quantity: 1}, (err, info) => {
//        console.log('response');
//        console.log('err',err);
//        console.log(info);
//        if (info && info.response)
//            console.log("response", info.response.data);
//            
//        let one_hundred  = Buffer.alloc(2);
//        one_hundred.writeUInt16BE(20, 0);
//        connection.writeSingleRegister({address:6126, value:one_hundred}, (err, data) => {
//            console.log('response',data);
//            console.log('err',err);
//            console.log('Write');
//        });
//    });
//}).listen(1024, () => {
//    console.log('server is running on 1024')
//});
