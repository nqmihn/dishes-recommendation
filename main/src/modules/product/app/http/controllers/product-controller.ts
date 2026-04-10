import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { normalizeResponseData } from 'src/core/helpers/utils';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';

// Product usecases
import { CreateProductUsecase } from 'src/modules/product/domain/usecases/product/create-product-usecase';
import { UpdateProductUsecase } from 'src/modules/product/domain/usecases/product/update-product-usecase';
import { GetProductUsecase } from 'src/modules/product/domain/usecases/product/get-product-usecase';
import { ListProductUsecase } from 'src/modules/product/domain/usecases/product/list-product-usecase';
import { DeleteProductUsecase } from 'src/modules/product/domain/usecases/product/delete-product-usecase';

// Variant usecases
import { CreateProductVariantUsecase } from 'src/modules/product/domain/usecases/variant/create-product-variant-usecase';
import { UpdateProductVariantUsecase } from 'src/modules/product/domain/usecases/variant/update-product-variant-usecase';
import { DeleteProductVariantUsecase } from 'src/modules/product/domain/usecases/variant/delete-product-variant-usecase';

// Image usecases
import { CreateProductImageUsecase } from 'src/modules/product/domain/usecases/image/create-product-image-usecase';
import { DeleteProductImageUsecase } from 'src/modules/product/domain/usecases/image/delete-product-image-usecase';

// Option group usecases
import { CreateProductOptionGroupUsecase } from 'src/modules/product/domain/usecases/option-group/create-product-option-group-usecase';
import { UpdateProductOptionGroupUsecase } from 'src/modules/product/domain/usecases/option-group/update-product-option-group-usecase';
import { DeleteProductOptionGroupUsecase } from 'src/modules/product/domain/usecases/option-group/delete-product-option-group-usecase';

// Option usecases
import { CreateProductOptionUsecase } from 'src/modules/product/domain/usecases/option/create-product-option-usecase';
import { UpdateProductOptionUsecase } from 'src/modules/product/domain/usecases/option/update-product-option-usecase';
import { DeleteProductOptionUsecase } from 'src/modules/product/domain/usecases/option/delete-product-option-usecase';

import { ProductModel } from 'src/modules/product/domain/models/product-model';
import { ProductSearchParams } from 'src/modules/product/domain/models/product-search-params';
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductQueryDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  CreateProductImageDto,
  CreateProductOptionGroupDto,
  UpdateProductOptionGroupDto,
  CreateProductOptionDto,
  UpdateProductOptionDto,
} from '../dtos/product-dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller({ path: 'api/v1/products' })
export class ProductController {
  constructor(
    private readonly createProductUsecase: CreateProductUsecase,
    private readonly updateProductUsecase: UpdateProductUsecase,
    private readonly getProductUsecase: GetProductUsecase,
    private readonly listProductUsecase: ListProductUsecase,
    private readonly deleteProductUsecase: DeleteProductUsecase,
    private readonly createProductVariantUsecase: CreateProductVariantUsecase,
    private readonly updateProductVariantUsecase: UpdateProductVariantUsecase,
    private readonly deleteProductVariantUsecase: DeleteProductVariantUsecase,
    private readonly createProductImageUsecase: CreateProductImageUsecase,
    private readonly deleteProductImageUsecase: DeleteProductImageUsecase,
    private readonly createProductOptionGroupUsecase: CreateProductOptionGroupUsecase,
    private readonly updateProductOptionGroupUsecase: UpdateProductOptionGroupUsecase,
    private readonly deleteProductOptionGroupUsecase: DeleteProductOptionGroupUsecase,
    private readonly createProductOptionUsecase: CreateProductOptionUsecase,
    private readonly updateProductOptionUsecase: UpdateProductOptionUsecase,
    private readonly deleteProductOptionUsecase: DeleteProductOptionUsecase,
  ) {}

  // ===================== PRODUCT CRUD =====================

  @ApiResponse({ status: HttpStatus.CREATED, type: ProductModel })
  @Post()
  async create(@Body() body: CreateProductDto, @Res() res: Response) {
    const product = await this.createProductUsecase.call(
      body.category_id,
      body.name,
      body.slug,
      body.description,
      body.short_description,
      body.base_price,
      body.thumbnail_url,
      body.is_active ?? true,
      body.is_featured ?? false,
      body.preparation_time,
      body.calories,
      body.tags,
      body.sort_order ?? 0,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(product));
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductModel })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto, @Res() res: Response) {
    const product = await this.updateProductUsecase.call(
      id,
      body.category_id,
      body.name,
      body.slug,
      body.description,
      body.short_description,
      body.base_price,
      body.thumbnail_url,
      body.is_active,
      body.is_featured,
      body.preparation_time,
      body.calories,
      body.tags,
      body.sort_order,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(product));
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductModel })
  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const product = await this.getProductUsecase.call(id);
    res.status(HttpStatus.OK).json(normalizeResponseData(product));
  }

  @ApiResponse({ status: HttpStatus.OK, type: ProductModel, isArray: true })
  @Get()
  async list(@Query() query: ListProductQueryDto, @Res() res: Response) {
    const pageParams = new PageParams(query.page, query.limit, query.need_total_count, query.only_count);
    const sortParams = new SortParams(query.sort, query.dir);
    const searchParams = new ProductSearchParams(
      query.search,
      query.category_id,
      query.is_active,
      query.is_featured,
      query.tags,
    );

    const result = await this.listProductUsecase.call(pageParams, sortParams, searchParams);
    res.status(HttpStatus.OK).json({
      page: result.page,
      total_count: result.totalCount,
      data: normalizeResponseData(result),
    });
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.deleteProductUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Product deleted successfully.' });
  }

  // ===================== VARIANTS =====================

  @ApiTags('Product Variants')
  @Post(':productId/variants')
  async createVariant(
    @Param('productId') productId: string,
    @Body() body: CreateProductVariantDto,
    @Res() res: Response,
  ) {
    const variant = await this.createProductVariantUsecase.call(
      productId,
      body.name,
      body.sku,
      body.price,
      body.original_price,
      body.stock_quantity ?? -1,
      body.is_default ?? false,
      body.is_active ?? true,
      body.sort_order ?? 0,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(variant));
  }

  @ApiTags('Product Variants')
  @Put('variants/:id')
  async updateVariant(@Param('id') id: string, @Body() body: UpdateProductVariantDto, @Res() res: Response) {
    const variant = await this.updateProductVariantUsecase.call(
      id,
      body.name,
      body.sku,
      body.price,
      body.original_price,
      body.stock_quantity,
      body.is_default,
      body.is_active,
      body.sort_order,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(variant));
  }

  @ApiTags('Product Variants')
  @Delete('variants/:id')
  async deleteVariant(@Param('id') id: string, @Res() res: Response) {
    await this.deleteProductVariantUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Variant deleted successfully.' });
  }

  // ===================== IMAGES =====================

  @ApiTags('Product Images')
  @Post(':productId/images')
  async createImage(
    @Param('productId') productId: string,
    @Body() body: CreateProductImageDto,
    @Res() res: Response,
  ) {
    const image = await this.createProductImageUsecase.call(
      productId,
      body.image_url,
      body.alt_text,
      body.sort_order ?? 0,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(image));
  }

  @ApiTags('Product Images')
  @Delete('images/:id')
  async deleteImage(@Param('id') id: string, @Res() res: Response) {
    await this.deleteProductImageUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Image deleted successfully.' });
  }

  // ===================== OPTION GROUPS =====================

  @ApiTags('Product Options')
  @Post(':productId/option-groups')
  async createOptionGroup(
    @Param('productId') productId: string,
    @Body() body: CreateProductOptionGroupDto,
    @Res() res: Response,
  ) {
    const group = await this.createProductOptionGroupUsecase.call(
      productId,
      body.name,
      body.is_required ?? false,
      body.min_selections ?? 0,
      body.max_selections ?? 1,
      body.sort_order ?? 0,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(group));
  }

  @ApiTags('Product Options')
  @Put('option-groups/:id')
  async updateOptionGroup(
    @Param('id') id: string,
    @Body() body: UpdateProductOptionGroupDto,
    @Res() res: Response,
  ) {
    const group = await this.updateProductOptionGroupUsecase.call(
      id,
      body.name,
      body.is_required,
      body.min_selections,
      body.max_selections,
      body.sort_order,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(group));
  }

  @ApiTags('Product Options')
  @Delete('option-groups/:id')
  async deleteOptionGroup(@Param('id') id: string, @Res() res: Response) {
    await this.deleteProductOptionGroupUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Option group deleted successfully.' });
  }

  // ===================== OPTIONS =====================

  @ApiTags('Product Options')
  @Post('option-groups/:groupId/options')
  async createOption(
    @Param('groupId') groupId: string,
    @Body() body: CreateProductOptionDto,
    @Res() res: Response,
  ) {
    const option = await this.createProductOptionUsecase.call(
      groupId,
      body.name,
      body.additional_price ?? 0,
      body.is_default ?? false,
      body.is_active ?? true,
      body.sort_order ?? 0,
    );
    res.status(HttpStatus.CREATED).json(normalizeResponseData(option));
  }

  @ApiTags('Product Options')
  @Put('options/:id')
  async updateOption(@Param('id') id: string, @Body() body: UpdateProductOptionDto, @Res() res: Response) {
    const option = await this.updateProductOptionUsecase.call(
      id,
      body.name,
      body.additional_price,
      body.is_default,
      body.is_active,
      body.sort_order,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(option));
  }

  @ApiTags('Product Options')
  @Delete('options/:id')
  async deleteOption(@Param('id') id: string, @Res() res: Response) {
    await this.deleteProductOptionUsecase.call(id);
    res.status(HttpStatus.OK).json({ message: 'Option deleted successfully.' });
  }
}
