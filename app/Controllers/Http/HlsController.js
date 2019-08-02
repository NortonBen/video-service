'use strict'
const Drive = use('Drive')

const CONTENT_TYPE = {
    MANIFEST: 'application/vnd.apple.mpegurl',
    SEGMENT: 'video/MP2T',
    HTML: 'text/html'
}

class HlsController {
    async manifest({ request, params, response }) {
        response.header('Content-Type', CONTENT_TYPE.MANIFEST)
        if (await Drive.exists(`${params.id}\\${params.file}.m3u8`)) {
            response.send('Not Found', 404)
        }
        response.send(await Drive.get(`${params.id}\\${params.file}.m3u8`))
    }

    async segment({ request, params, response }) {
        response.header('Content-type', CONTENT_TYPE.SEGMENT)
        if (await Drive.exists(`${params.id}\\${params.file}.ts`)) {
            response.send('Not Found', 404)
        }
        response.send(await Drive.get(`${params.id}\\${params.file}.ts`))
    }
}

module.exports = HlsController
