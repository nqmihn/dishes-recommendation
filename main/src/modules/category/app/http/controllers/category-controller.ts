import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { CategoryModel } from 'src/modules/category/domain/models/category-model';
import { CategorySearchParams } from 'src/modules/category/domain/models/category-search-params';
import { CreateCategoryDto, ListCategoryQueryDto, UpdateCategoryDto } from '../dtos/category-dto';

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

  /**
   * Create a new category
   */
  @ApiResponse({ status: HttpStatus.CREATED, type: CategoryModel })
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

  /**
   * Update an existing category
   */
  @ApiResponse({ status: HttpStatus.OK, type: CategoryModel })
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

  /**
   * Get a category by ID
   */
  @ApiResponse({ status: HttpStatus.OK, type: CategoryModel })
  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const category = await this.getCategoryUsecase.call(id);
    res.status(HttpStatus.OK).json(normalizeResponseData(category));
  }

  /**
   * List categories with pagination & search
   */
  @ApiResponse({ status: HttpStatus.OK, type: CategoryModel, isArray: true })
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

  /**
   * Delete a category
   */
  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.deleteCategoryUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Category deleted successfully.' });
  }

  /**
   * Get full category tree (nested)
   */
  @ApiResponse({ status: HttpStatus.OK, type: CategoryModel, isArray: true })
  @Get('tree/all')
  async tree(@Res() res: Response) {
    const tree = await this.getCategoryTreeUsecase.call();
    res.status(HttpStatus.OK).json(tree.map((c) => c.toJson()));
  }
}
