import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { normalizeResponseData } from 'src/core/helpers/utils';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { CreateCategoryUsecase } from 'src/modules/category/domain/usecases/create-category-usecase';
import { UpdateCategoryUsecase } from 'src/modules/category/domain/usecases/update-category-usecase';
import { GetCategoryUsecase } from 'src/modules/category/domain/usecases/get-category-usecase';
import { ListCategoryUsecase } from 'src/modules/category/domain/usecases/list-category-usecase';
import { DeleteCategoryUsecase } from 'src/modules/category/domain/usecases/delete-category-usecase';
import { GetCategoryTreeUsecase } from 'src/modules/category/domain/usecases/get-category-tree-usecase';
import { CategorySearchParams } from 'src/modules/category/domain/models/category-search-params';
import { CreateCategoryDto, ListCategoryQueryDto, UpdateCategoryDto } from '../dtos/category-dto';

const EXAMPLE_CATEGORY = {
  id: '01960000-0000-7000-0000-000000000010',
  parent_id: null,
  name: 'Món Phở',
  slug: 'mon-pho',
  description: 'Các món phở truyền thống Việt Nam',
  image_url: 'https://example.com/images/pho-category.jpg',
  sort_order: 1,
  is_active: true,
  created_at: '2026-04-10T10:00:00.000Z',
  updated_at: '2026-04-10T10:00:00.000Z',
};

const EXAMPLE_CATEGORY_TREE = {
  ...EXAMPLE_CATEGORY,
  children: [
    {
      id: '01960000-0000-7000-0000-000000000011',
      parent_id: '01960000-0000-7000-0000-000000000010',
      name: 'Phở Bò',
      slug: 'pho-bo',
      description: 'Các món phở bò',
      image_url: null,
      sort_order: 0,
      is_active: true,
      created_at: '2026-04-10T10:00:00.000Z',
      updated_at: '2026-04-10T10:00:00.000Z',
      children: [],
    },
  ],
};

@ApiTags('Categories')
@ApiBearerAuth()
@Controller({ path: 'api/v1/categories' })
export class CategoryController {
  constructor(
    private readonly createCategoryUsecase: CreateCategoryUsecase,
    private readonly updateCategoryUsecase: UpdateCategoryUsecase,
    private readonly getCategoryUsecase: GetCategoryUsecase,
    private readonly listCategoryUsecase: ListCategoryUsecase,
    private readonly deleteCategoryUsecase: DeleteCategoryUsecase,
    private readonly getCategoryTreeUsecase: GetCategoryTreeUsecase,
  ) {}

  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Danh mục vừa được tạo',
    schema: { example: EXAMPLE_CATEGORY },
  })
  @Post()
  async create(@Body() body: CreateCategoryDto, @Res() res: Response) {
    const category = await this.createCategoryUsecase.call(
      body.name,
      body.slug,
      body.description,
      body.image_url,
      body.parent_id,
      body.sort_order ?? 0,
      body.is_active ?? true,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(category));
  }

  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh mục sau khi cập nhật',
    schema: { example: EXAMPLE_CATEGORY },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: { example: { message: 'Category not found.' } } })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCategoryDto, @Res() res: Response) {
    const category = await this.updateCategoryUsecase.call(
      id,
      body.name,
      body.slug,
      body.description,
      body.image_url,
      body.parent_id,
      body.sort_order,
      body.is_active,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(category));
  }

  @ApiOperation({ summary: 'Lấy chi tiết danh mục theo ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chi tiết danh mục',
    schema: { example: EXAMPLE_CATEGORY },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: { example: { message: 'Category not found.' } } })
  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const category = await this.getCategoryUsecase.call(id);
    res.status(HttpStatus.OK).json(normalizeResponseData(category));
  }

  @ApiOperation({ summary: 'Danh sách danh mục có phân trang, lọc, tìm kiếm' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách danh mục',
    schema: {
      example: {
        page: 1,
        total_count: 10,
        data: [EXAMPLE_CATEGORY],
      },
    },
  })
  @Get()
  async list(@Query() query: ListCategoryQueryDto, @Res() res: Response) {
    const pageParams = new PageParams(query.page, query.limit, query.need_total_count, query.only_count);
    const sortParams = new SortParams(query.sort, query.dir);
    const searchParams = new CategorySearchParams(query.search, query.parent_id, query.is_active);

    const result = await this.listCategoryUsecase.call(pageParams, sortParams, searchParams);
    res.status(HttpStatus.OK).json({
      page: result.page,
      total_count: result.totalCount,
      data: normalizeResponseData(result),
    });
  }

  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: HttpStatus.OK, schema: { example: { message: 'Category deleted successfully.' } } })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, schema: { example: { message: 'Category not found.' } } })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.deleteCategoryUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Category deleted successfully.' });
  }

  @ApiOperation({ summary: 'Lấy toàn bộ cây danh mục (nested)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cây danh mục với children lồng nhau',
    schema: { example: [EXAMPLE_CATEGORY_TREE] },
  })
  @Get('tree/all')
  async tree(@Res() res: Response) {
    const tree = await this.getCategoryTreeUsecase.call();
    res.status(HttpStatus.OK).json(tree.map((c) => c.toJson()));
  }
}
