const  Config = use('Config')
var ffmpeg = require('fluent-ffmpeg')
const Logger = use('Logger')
const mkdirp = use('mkdirp')


class ConvertVideoChannel {


    handler(error, channel) {
        if(error) {
            Logger.error('connect RabbitMQ in ProcessVideoChannel fail')
            throw error
        }
        this.channelConvertFile(channel)
    }


    channelConvertFile(channel) {
        const queue = 'convert_video_queue'
        channel.channel.assertQueue(queue, {durable: true})
        channel.channel.prefetch(1)
        channel.consumeJson(queue, ({ path, id, size }, msg) => {
            if (size == undefined) {
                size = "480x360"
            }
            Logger.info('Run ffmpeg convert %s  to %s', path, Config.get('drive.disks.m3u8.root')+`//${id}//${id}.m3u8`)
            // channel.channel.ack(msg)
            mkdirp(Config.get('drive.disks.m3u8.root')+`//${id}`, function (err) {
                if (err) {
                    Logger.info('Error Create folder %s' ,err)
                    throw err
                }
               
                ffmpeg(path, { timeout: 432000 }).addOptions([
                    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
                    '-level 3.0', 
                    '-s '+size,          // 640px width, 360px height output video dimensions
                    '-start_number 0',     // start the first .ts segment at index 0
                    '-hls_time 10',        // 10 second segment duration
                    '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
                    '-f hls'               // HLS format
                  ]).output(Config.get('drive.disks.m3u8.root')+`//${id}//${id}.m3u8`).on('end', () => {
                    try {
                        channel.sendJson(msg.properties.replyTo, { id }, {correlationId: msg.properties.correlationId, persistent: true})
                    } catch(err) {
                        Logger.info('Error Callback %s' ,err)
                    }
                    channel.channel.ack(msg)
                  }).on('error', (err) => {
                    Logger.error('Run ffmpeg error %s', err)
                }).run()
            });
           
        })
    }
}

module.exports = ConvertVideoChannel;