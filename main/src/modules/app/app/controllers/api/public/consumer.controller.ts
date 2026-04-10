import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from "@nestjs/microservices";
import { usleep } from "src/core/helpers/utils";

@Controller()
export class ProxyConsumer {

  @MessagePattern('user.created')
  async handleProxyPublish(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('Received message from RabbitMQ:');
    console.log('Pattern:', context.getPattern());
    console.log('Data:', data);
    // await usleep(6000);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    throw new RpcException('ok nah nah');
    // return 'ok';
  }

  // @MessagePattern('invoice.*')
  // async handleInvoiceMessages(
  //   @Payload() data: any,
  //   @Ctx() context: RmqContext,
  // ) {
  //   console.log('Received invoice message from RabbitMQ:');
  //   console.log('Pattern:', context.getPattern());
  //   console.log('Data:', data);
  //   const channel = context.getChannelRef();
  //   const originalMsg = context.getMessage();
  //   channel.ack(originalMsg);
  //   return 1111
  // }
}
