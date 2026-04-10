import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SendChatMessageUsecase } from 'src/modules/chat/domain/usecases/send-chat-message-usecase';
import { GetChatHistoryUsecase } from 'src/modules/chat/domain/usecases/get-chat-history-usecase';
import { SendChatMessageDto } from '../dtos/chat-dto';

const EXAMPLE_PRODUCT = {
  id: '01960000-0000-7000-0000-000000000001',
  category_id: '01960000-0000-7000-0000-000000000010',
  name: 'Phở Bò Đặc Biệt',
  slug: 'pho-bo-dac-biet',
  description: 'Phở bò với nước dùng hầm 12 tiếng, thịt bò tươi mềm.',
  short_description: 'Phở bò nước dùng đậm đà',
  base_price: 75000,
  thumbnail_url: 'https://example.com/images/pho-bo.jpg',
  is_active: true,
  is_featured: true,
  preparation_time: 10,
  calories: 450,
  tags: ['beef', 'noodle', 'hot'],
  sort_order: 1,
  created_at: '2026-04-10T10:00:00.000Z',
  updated_at: '2026-04-10T10:00:00.000Z',
  ai_metadata: {
    category_name: 'Món chính',
    base_price: 75000,
    is_featured: true,
    tags: ['beef', 'noodle'],
    calories: 450,
    preparation_time: 10,
  },
};

@ApiTags('Chat')
@Controller({ path: 'api/v1/chat' })
export class ChatController {
  constructor(
    private readonly sendChatMessageUsecase: SendChatMessageUsecase,
    private readonly getChatHistoryUsecase: GetChatHistoryUsecase,
  ) {}

  @ApiOperation({
    summary: 'Gửi tin nhắn chat để nhận gợi ý món ăn',
    description:
      'Gửi tin nhắn của user. Nếu `session_token` được cung cấp, cuộc trò chuyện sẽ tiếp tục từ session đó. Nếu không, một session mới sẽ được tạo. Trả về câu trả lời AI kèm danh sách sản phẩm được gợi ý.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'AI recommendation kèm danh sách sản phẩm',
    schema: {
      example: {
        data: {
          session_token: '01960000-0000-7000-0000-000000000abc',
          message:
            'Dựa trên yêu cầu của bạn, tôi gợi ý Phở Bò Đặc Biệt — món nước nóng hổi với nước dùng hầm 12 tiếng rất phù hợp cho bữa sáng hoặc buổi chiều mát. Bạn có muốn thêm topping gì không?',
          products: [EXAMPLE_PRODUCT],
        },
      },
    },
  })
  @Post('send')
  async sendMessage(@Body() body: SendChatMessageDto, @Res() res: Response) {
    const result = await this.sendChatMessageUsecase.call(body.session_token, body.message);
    return res.status(HttpStatus.OK).json({ data: result });
  }

  @ApiOperation({
    summary: 'Lấy lịch sử chat theo session token',
    description: 'Trả về toàn bộ lịch sử tin nhắn (user + assistant) của một session chat.',
  })
  @ApiParam({ name: 'sessionToken', description: 'Session token nhận được từ endpoint /send', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lịch sử chat của session',
    schema: {
      example: {
        data: {
          session_token: '01960000-0000-7000-0000-000000000abc',
          title: null,
          messages: [
            {
              id: '01960000-0000-7000-0000-000000000001',
              session_id: '01960000-0000-7000-0000-000000000abc',
              role: 'user',
              content: 'Tôi muốn ăn gì đó nhẹ, ít calo cho bữa trưa',
              metadata: null,
              created_at: '2026-04-10T10:00:00.000Z',
            },
            {
              id: '01960000-0000-7000-0000-000000000002',
              session_id: '01960000-0000-7000-0000-000000000abc',
              role: 'assistant',
              content: 'Dựa trên yêu cầu của bạn, tôi gợi ý Phở Bò Đặc Biệt...',
              metadata: { products: [EXAMPLE_PRODUCT] },
              created_at: '2026-04-10T10:00:05.000Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session không tồn tại',
    schema: { example: { message: 'Session not found' } },
  })
  @Get('history/:sessionToken')
  async getHistory(@Param('sessionToken') sessionToken: string, @Res() res: Response) {
    const result = await this.getChatHistoryUsecase.call(sessionToken);

    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Session not found' });
    }

    return res.status(HttpStatus.OK).json({ data: result });
  }
}

