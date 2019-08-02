const amqp = require('amqplib/callback_api')

class RabbitMQ {

    constructor(Config,Server, Logger, app ) {
        this._chanels = []
        this.app = app;
        this._connect = null
        this._host = Config.get('rabbitmq.host');

        Server.getInstance().on('listening', () => {
            amqp.connect(this._host, (err, conn) => {
                if (conn) {
                    Logger.info('Connect RabbitMQ Server.....')
                    this._connect = conn
                    this._register()
                }
                if (err) {
                    throw err
                }
            })
        })
    }

    _register() {
        this._chanels.map(chanel => {
            this.createChannel(chanel)
        })
    }

    createChannel(channeler) {
        const Channel = this.app.use('Norton/ChannelMQ')
        this._connect.createChannel((error, ch) => {
            const channel = new Channel(ch)
            channeler.handler(error, channel)
        })
        
    }


    channel(handler) {
        let channeler = { handler };
        if (typeof(handler) !== 'function') {
            channeler = this.app.make(handler)
        }
        if (this._connect != null) {
            this.createChannel(channeler)
        }
        this._chanels.push(channeler)
        return this;
    }
}



module.exports = RabbitMQ