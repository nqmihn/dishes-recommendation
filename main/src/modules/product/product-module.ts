import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './data/entities/product-entity';
import { ProductVariantEntity } from './data/entities/product-variant-entity';
import { ProductImageEntity } from './data/entities/product-image-entity';
import { ProductOptionGroupEntity } from './data/entities/product-option-group-entity';
import { ProductOptionEntity } from './data/entities/product-option-entity';

// Datasources
import { ProductDatasource } from './data/datasources/product-datasource';
import { ProductVariantDatasource } from './data/datasources/product-variant-datasource';
import { ProductImageDatasource } from './data/datasources/product-image-datasource';
import { ProductOptionGroupDatasource } from './data/datasources/product-option-group-datasource';
import { ProductOptionDatasource } from './data/datasources/product-option-datasource';

// Repository interfaces
import { ProductRepository } from './domain/repositories/product-repository';
import { ProductVariantRepository } from './domain/repositories/product-variant-repository';
import { ProductImageRepository } from './domain/repositories/product-image-repository';
import { ProductOptionGroupRepository } from './domain/repositories/product-option-group-repository';
import { ProductOptionRepository } from './domain/repositories/product-option-repository';

// Repository implementations
import { ProductRepositoryImpl } from './data/repositories/product-repository-impl';
import { ProductVariantRepositoryImpl } from './data/repositories/product-variant-repository-impl';
import { ProductImageRepositoryImpl } from './data/repositories/product-image-repository-impl';
import { ProductOptionGroupRepositoryImpl } from './data/repositories/product-option-group-repository-impl';
import { ProductOptionRepositoryImpl } from './data/repositories/product-option-repository-impl';

// Product usecases
import { CreateProductUsecase } from './domain/usecases/product/create-product-usecase';
import { UpdateProductUsecase } from './domain/usecases/product/update-product-usecase';
import { GetProductUsecase } from './domain/usecases/product/get-product-usecase';
import { ListProductUsecase } from './domain/usecases/product/list-product-usecase';
import { DeleteProductUsecase } from './domain/usecases/product/delete-product-usecase';
import { ImportAllProductSearchDocumentsUseCase } from './domain/usecases/product/import-all-product-search-documents-usecase';

// Variant usecases
import { CreateProductVariantUsecase } from './domain/usecases/variant/create-product-variant-usecase';
import { UpdateProductVariantUsecase } from './domain/usecases/variant/update-product-variant-usecase';
import { DeleteProductVariantUsecase } from './domain/usecases/variant/delete-product-variant-usecase';

// Image usecases
import { CreateProductImageUsecase } from './domain/usecases/image/create-product-image-usecase';
import { DeleteProductImageUsecase } from './domain/usecases/image/delete-product-image-usecase';

// Option group usecases
import { CreateProductOptionGroupUsecase } from './domain/usecases/option-group/create-product-option-group-usecase';
import { UpdateProductOptionGroupUsecase } from './domain/usecases/option-group/update-product-option-group-usecase';
import { DeleteProductOptionGroupUsecase } from './domain/usecases/option-group/delete-product-option-group-usecase';

// Option usecases
import { CreateProductOptionUsecase } from './domain/usecases/option/create-product-option-usecase';
import { UpdateProductOptionUsecase } from './domain/usecases/option/update-product-option-usecase';
import { DeleteProductOptionUsecase } from './domain/usecases/option/delete-product-option-usecase';
import { BulkCreateProductsUsecase } from './domain/usecases/product/bulk-create-products-usecase';

import { ProductController } from './app/http/controllers/product-controller';
import { CategoryModule } from '../category/category-module';
import { SearchModule } from '../search/search-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariantEntity,
      ProductImageEntity,
      ProductOptionGroupEntity,
      ProductOptionEntity,
    ]),
    CategoryModule,
    forwardRef(() => SearchModule),
  ],
  providers: [
    // Datasources
    ProductDatasource,
    ProductVariantDatasource,
    ProductImageDatasource,
    ProductOptionGroupDatasource,
    ProductOptionDatasource,

    // Repositories
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: ProductVariantRepository,
      useClass: ProductVariantRepositoryImpl,
    },
    {
      provide: ProductImageRepository,
      useClass: ProductImageRepositoryImpl,
    },
    {
      provide: ProductOptionGroupRepository,
      useClass: ProductOptionGroupRepositoryImpl,
    },
    {
      provide: ProductOptionRepository,
      useClass: ProductOptionRepositoryImpl,
    },

    // Product usecases
    CreateProductUsecase,
    UpdateProductUsecase,
    GetProductUsecase,
    ListProductUsecase,
    DeleteProductUsecase,
    ImportAllProductSearchDocumentsUseCase,
    BulkCreateProductsUsecase,

    // Variant usecases
    CreateProductVariantUsecase,
    UpdateProductVariantUsecase,
    DeleteProductVariantUsecase,

    // Image usecases
    CreateProductImageUsecase,
    DeleteProductImageUsecase,

    // Option group usecases
    CreateProductOptionGroupUsecase,
    UpdateProductOptionGroupUsecase,
    DeleteProductOptionGroupUsecase,

    // Option usecases
    CreateProductOptionUsecase,
    UpdateProductOptionUsecase,
    DeleteProductOptionUsecase,
  ],
  controllers: [ProductController],
  exports: [
    ProductRepository,
    ListProductUsecase,
    ImportAllProductSearchDocumentsUseCase,
    BulkCreateProductsUsecase,
  ],
})
export class ProductModule {}
