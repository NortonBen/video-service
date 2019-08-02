'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const { Ignitor } = require('@adonisjs/ignitor')

class HlsServerProvider extends ServiceProvider {
 
  _registerRabbitMQ () {
    this.app.singleton('Norton/RabbitMQ', (app) => {
        const RabbiMQ = require('./RabbitMQ')
        const Config = app.use('Adonis/Src/Config')
        const Logger = app.use('Logger')
        const Server = app.use('Adonis/Src/Server')
        return new RabbiMQ(Config,Server, Logger, app)
    })
    this.app.alias('Norton/RabbitMQ', 'RabbitMQ')
  }

  _registerChannel () {
    this.app.bind('Norton/ChannelMQ', (app) => {
        return require('./Channel')
    })
  }

  register () {
    this._registerChannel()
    this._registerRabbitMQ()
  }

  _registerFileRabbitMQ () {
    new Ignitor(require('@adonisjs/fold'))
      .preLoad('start/rabbitmq')
  }

  
  boot () {
    this._registerFileRabbitMQ();
  }
}

module.exports = HlsServerProvider
