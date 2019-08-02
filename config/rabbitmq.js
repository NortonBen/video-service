'use strict'

const Env = use('Env')

module.exports = {
    host: Env.get('HOST_RABIITMQ', 'amqp://localhost')
}
