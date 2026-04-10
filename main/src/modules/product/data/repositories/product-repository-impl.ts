import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { ProductDatasource } from '../datasources/product-datasource';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { ProductModel } from '../../domain/models/product-model';
import { ProductSearchParams } from '../../domain/models/product-search-params';

@Injectable()
export class ProductRepositoryImpl extends ProductRepository {
  constructor(private readonly productDatasource: ProductDatasource) {
    super();
  }

  public async create(product: ProductModel): Promise<ProductModel> {
    await this.productDatasource.addProduct(product);
    return product;
  }

  public async createMany(products: ProductModel[]): Promise<ProductModel[]> {
    await this.productDatasource.addManyProducts(products);
    return products;
  }

  public async update(product: ProductModel): Promise<ProductModel> {
    await this.productDatasource.updateProduct(product);
    return product;
  }

  public async findById(id: string): Promise<ProductModel | undefined> {
    return await this.productDatasource.findProductById(id);
  }

  public async findManyByIds(ids: string[]): Promise<ProductModel[]> {
    return await this.productDatasource.findProductsByIds(ids);
  }

  public async findByIdWithRelations(id: string): Promise<ProductModel | undefined> {
    return await this.productDatasource.findProductByIdWithRelations(id);
  }

  public async findBySlug(slug: string): Promise<ProductModel | undefined> {
    return await this.productDatasource.findProductBySlug(slug);
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: ProductSearchParams,
  ): Promise<PageList<ProductModel>> {
    return await this.productDatasource.listProducts(pageParams, sortParams, searchParams);
  }

  public async delete(id: string): Promise<void> {
    await this.productDatasource.deleteProduct(id);
  }
}
