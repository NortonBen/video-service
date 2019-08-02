
const RabbitMQ = use('RabbitMQ')


RabbitMQ.channel('App/Channels/ConvertVideoChannel')
RabbitMQ.channel('App/Channels/IdentificationChannel')