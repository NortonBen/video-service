const Env = use('Env')
const os = use('os')
const Server = use('Server')
const Logger = use('Logger')
const uniqid = use('uniqid')

class IdentificationChannel {

    handler(error, channel) {
        if(error) {
            Logger.error('connect RabbitMQ in ProcessVideoChannel fail')
            throw error
        }
        this.id = uniqid();
        this.channelIdentification(channel)
    }

    channelIdentification(channel) {
        const ex = 'check_service'
        const result_ex = 'check_servicen_result'
        const id = this.id
        channel.channel.assertExchange(ex, 'fanout', {durable: false})
        channel.channel.assertExchange(result_ex, 'fanout', {durable: false})

        channel.channel.assertQueue('', {exclusive: true}, function(err, q) {
            if (err) {
                Logger.info('Error assertQueue %s' ,err)
                throw err
            }
            channel.channel.bindQueue(q.queue, ex, '');
            channel.consumeJson(q.queue, function(msg) {
                Logger.info('Get Info' )
                channel.publishJson(result_ex, '',  {
                    app_id: Env.get('APP_KEY'), 
                    id: id,
                    cpus: os.cpus(),
                    freemem: os.freemem(),
                    host: Env.get('APP_URL'),
                    connect: Server.getInstance()._connections,
                    type: 'video_service'
                });
            }, {noAck: true});
        });
    }
}

module.exports = IdentificationChannel