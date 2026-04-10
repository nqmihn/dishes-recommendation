import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './data/entities/category-entity';
import { CategoryDatasource } from './data/datasources/category-datasource';
import { CategoryRepository } from './domain/repositories/category-repository';
import { CategoryRepositoryImpl } from './data/repositories/category-repository-impl';
import { CreateCategoryUsecase } from './domain/usecases/create-category-usecase';
import { UpdateCategoryUsecase } from './domain/usecases/update-category-usecase';
import { GetCategoryUsecase } from './domain/usecases/get-category-usecase';
import { ListCategoryUsecase } from './domain/usecases/list-category-usecase';
import { DeleteCategoryUsecase } from './domain/usecases/delete-category-usecase';
import { GetCategoryTreeUsecase } from './domain/usecases/get-category-tree-usecase';
import { BulkCreateCategoriesUsecase } from './domain/usecases/bulk-create-categories-usecase';
import { CategoryController } from './app/http/controllers/category-controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    CategoryDatasource,
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    CreateCategoryUsecase,
    UpdateCategoryUsecase,
    GetCategoryUsecase,
    ListCategoryUsecase,
    DeleteCategoryUsecase,
    GetCategoryTreeUsecase,
    BulkCreateCategoriesUsecase,
  ],
  controllers: [CategoryController],
  exports: [CategoryRepository, BulkCreateCategoriesUsecase],
})
export class CategoryModule {}
