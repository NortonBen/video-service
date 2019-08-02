

class Channel {
    constructor(channel) {
        this.channel = channel;
    }

    sendJson(name, data, otpion = null) {
        try {
            if (otpion == null) {
                this.channel.sendToQueue(name, Buffer.from(JSON.stringify(data)))
            } else {
                this.channel.sendToQueue(name, Buffer.from(JSON.stringify(data)), otpion)
            }
         
        } catch(e) {
            console.error('data no json')
            console.error(e)
        }
        
    }
    
    publishJson(ex, name, data) {
        this.channel.publish(ex, name, Buffer.from(JSON.stringify(data)))
    }

    consumeJson(name, callback, option = null) {
        if( option == null) {
            this.channel.consume(name, function(msg) {
                try {
                    const data = JSON.parse(msg.content.toString())
                    callback(data, msg)
                } catch(e) {
                    console.error('data no json')
                    console.error(e)
                }
              
            });
        } else {
            this.channel.consume(name, function(msg) {
                try {
                    const data = JSON.parse(msg.content.toString())
                    callback(data, msg)
                } catch(e) {
                    console.error('data no json')
                    console.error(e)
                }
              
            }, option);
        }       
        
    }
}

module.exports = Channel
