import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { SearchUsecase } from 'src/modules/search/domain/usecases/search-usecase';
import { ProductEntity } from '../entities/product-entity';
import { ProductModel } from '../../domain/models/product-model';
import { ProductSearchParams } from '../../domain/models/product-search-params';
import { ProductVariantDatasource } from './product-variant-datasource';
import { ProductImageDatasource } from './product-image-datasource';
import { ProductOptionGroupDatasource } from './product-option-group-datasource';
import { ProductOptionDatasource } from './product-option-datasource';
import { ProductOptionGroupModel } from '../../domain/models/product-option-group-model';

@Injectable()
export class ProductDatasource {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    private readonly searchUsecase: SearchUsecase,
    private readonly variantDatasource: ProductVariantDatasource,
    private readonly imageDatasource: ProductImageDatasource,
    private readonly optionGroupDatasource: ProductOptionGroupDatasource,
    private readonly optionDatasource: ProductOptionDatasource,
  ) {}

  // ===================== PRODUCT =====================

  public async addProduct(product: ProductModel): Promise<void> {
    const entity = this.productRepo.create({
      id: product.id,
      category_id: product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.shortDescription,
      base_price: product.basePrice,
      thumbnail_url: product.thumbnailUrl,
      is_active: product.isActive,
      is_featured: product.isFeatured,
      preparation_time: product.preparationTime,
      calories: product.calories,
      tags: product.tags,
      sort_order: product.sortOrder,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    });

    await this.productRepo.insert(entity);
  }

  public async addManyProducts(products: ProductModel[]): Promise<void> {
    if (products.length === 0) return;
    const entities = products.map((product) =>
      this.productRepo.create({
        id: product.id,
        category_id: product.categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription,
        base_price: product.basePrice,
        thumbnail_url: product.thumbnailUrl,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        preparation_time: product.preparationTime,
        calories: product.calories,
        tags: product.tags,
        sort_order: product.sortOrder,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      }),
    );
    await this.productRepo.insert(entities);
  }

  public async updateProduct(product: ProductModel): Promise<void> {
    await this.productRepo.update(product.id, {
      category_id: product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.shortDescription,
      base_price: product.basePrice,
      thumbnail_url: product.thumbnailUrl,
      is_active: product.isActive,
      is_featured: product.isFeatured,
      preparation_time: product.preparationTime,
      calories: product.calories,
      tags: product.tags,
      sort_order: product.sortOrder,
      updated_at: product.updatedAt,
    });
  }

  public async findProductById(id: string): Promise<ProductModel | undefined> {
    const entity = await this.productRepo.findOne({ where: { id } });
    return entity?.toModel();
  }

  public async findProductBySlug(slug: string): Promise<ProductModel | undefined> {
    const entity = await this.productRepo.findOne({ where: { slug } });
    return entity?.toModel();
  }

  public async findProductByIdWithRelations(id: string): Promise<ProductModel | undefined> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) return undefined;

    const product = entity.toModel();
    const variants = await this.variantDatasource.findVariantsByProductId(id);
    const images = await this.imageDatasource.findImagesByProductId(id);
    const optionGroups = await this.optionGroupDatasource.findOptionGroupsByProductId(id);

    // Load options for each group
    const groupsWithOptions: ProductOptionGroupModel[] = [];
    for (const group of optionGroups) {
      const options = await this.optionDatasource.findOptionsByGroupId(group.id);
      groupsWithOptions.push(group.copyWith({ options }));
    }

    return product.copyWith({
      variants,
      images,
      optionGroups: groupsWithOptions,
    });
  }

  public async listProducts(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: ProductSearchParams,
  ): Promise<PageList<ProductModel>> {
    const condition: FindOptionsWhere<ProductEntity> = {};
    const orderBy: Record<string, any> = {};

    let searchResultIds: string[] = [];
    if (searchParams.search) {
      const searchResult = await this.searchUsecase.call(
        ProductModel.searchIndexName,
        searchParams.search,
        3000,
        undefined,
        undefined,
      );

      searchResultIds = searchResult.hits.map((document: Record<string, any>) => document.id);
      if (searchResultIds.length === 0) {
        return new PageList(pageParams.page, 0, []);
      }
      condition.id = In(searchResultIds);
      orderBy['order_id'] = 'ASC';
    } else {
      orderBy[sortParams.sort] = sortParams.dir;
    }

    if (searchParams.categoryId) {
      condition.category_id = searchParams.categoryId;
    }
    if (searchParams.isActive !== undefined) {
      condition.is_active = searchParams.isActive;
    }
    if (searchParams.isFeatured !== undefined) {
      condition.is_featured = searchParams.isFeatured;
    }

    const query = this.productRepo.createQueryBuilder('product').setFindOptions({
      where: condition,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: searchParams.search ? {} : orderBy,
    });

    // Tag filter via raw WHERE
    if (searchParams.tags && searchParams.tags.length > 0) {
      searchParams.tags.forEach((tag, index) => {
        query.andWhere(`product.tags @> :tag${index}`, { [`tag${index}`]: JSON.stringify([tag]) });
      });
    }

    // Meilisearch ordering by relevance
    if (searchParams.search && searchResultIds.length > 0) {
      query.addSelect(`ARRAY_POSITION(ARRAY['${searchResultIds.join(`','`)}']::VARCHAR[], product.id)`, 'order_id');
      query.orderBy(orderBy);
    }

    let totalCount;
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    let products: ProductEntity[] = [];
    if (!pageParams.onlyCount) {
      products = await query.getMany();
    }

    return new PageList(
      pageParams.page,
      totalCount,
      products.map((p) => p.toModel()),
    );
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }
}
