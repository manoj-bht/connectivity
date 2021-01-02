var modbus = require("modbus-stream");
modbus.serial.connect("COM1", {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    debug: "automaton-0"
}, (err, connection) => {
    if (err)
        throw err;
    connection.readHoldingRegisters({address: 7120, quantity: 10, extra: {slaveId: 25, retry: 3000}}, (err, info) => {
        if (err)
            throw err;
        console.log('response');
        if (info && info.response) {
            console.log(info.response.data);
            //read float value
            var hexVal = info.response.data[1].toString("hex");
            console.log(hexVal);
            var str = '0x' + hexVal + '0000';
            console.log(str);
            function parseFloat(str) {
                var float = 0, sign, order, mantiss, exp,
                        int = 0, multi = 1;
                if (/^0x/.exec(str)) {
                    int = parseInt(str, 16);
                } else {
                    for (var i = str.length - 1; i >= 0; i -= 1) {
                        if (str.charCodeAt(i) > 255) {
                            console.log('Wrong string parametr');
                            return false;
                        }
                        int += str.charCodeAt(i) * multi;
                        multi *= 256;
                    }
                }
                sign = (int >>> 31) ? -1 : 1;
                exp = (int >>> 23 & 0xff) - 127;
                mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
                for (i = 0; i < mantissa.length; i += 1) {
                    float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
                    exp--;
                }
                return float * sign;
            }
            console.log(parseFloat(str));
            // read integer value
            //console.log(info.response.data[0].readInt16BE(0));
            //console.log(info.response.data[1].readInt16BE(0));
            let writeData = Buffer.alloc(4);
            //let one_thousand = Buffer.alloc(2);
            //let ten_thousand = Buffer.alloc(2);
            // write integer value (also in case of float write only integer)
            writeData.writeUInt16BE(80, 0)
            console.log('writeData', writeData);



            //one_thousand.writeUInt16BE(1000, 0);
            //ten_thousand.writeUInt16BE(10000, 0);
            /*connection.writeSingleRegister({ address: 6126, values: writeData, extra: { slaveId: 25, retry:3000 } }, (err, info) => {
             if (err) throw err;
             console.log("success");
             console.log("response", info.response);
             });*/

            connection.writeMultipleRegisters({address: 4103, values: [writeData], extra: {slaveId: 25, retry: 3000}}, (err, info) => {
                if (err)
                    throw err;
                console.log("responseW", info.response);
                connection.readHoldingRegisters({address: 4103, quantity: 10, extra: {slaveId: 25, retry: 3000}}, (err, info) => {
                    if (err)
                        throw err;
                    console.log('response1', info.response);
                    var hexVal = info.response.data[0].toString("hex");
                    console.log(hexVal);
                    var str = '0x' + hexVal + '0000';
                    console.log(str);
                    function parseFloat(str) {
                        var float = 0, sign, order, mantiss, exp,
                                int = 0, multi = 1;
                        if (/^0x/.exec(str)) {
                            int = parseInt(str, 16);
                        } else {
                            for (var i = str.length - 1; i >= 0; i -= 1) {
                                if (str.charCodeAt(i) > 255) {
                                    console.log('Wrong string parametr');
                                    return false;
                                }
                                int += str.charCodeAt(i) * multi;
                                multi *= 256;
                            }
                        }
                        sign = (int >>> 31) ? -1 : 1;
                        exp = (int >>> 23 & 0xff) - 127;
                        mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
                        for (i = 0; i < mantissa.length; i += 1) {
                            float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
                            exp--;
                        }
                        return float * sign;
                    }
                    console.log(parseFloat(str));
                })
            });
        }
    });

});
