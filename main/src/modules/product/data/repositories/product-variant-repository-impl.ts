import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from '../../domain/repositories/product-variant-repository';
import { ProductVariantDatasource } from '../datasources/product-variant-datasource';
import { ProductVariantModel } from '../../domain/models/product-variant-model';

@Injectable()
export class ProductVariantRepositoryImpl extends ProductVariantRepository {
  constructor(private readonly variantDatasource: ProductVariantDatasource) {
    super();
  }

  public async create(variant: ProductVariantModel): Promise<ProductVariantModel> {
    await this.variantDatasource.addVariant(variant);
    return variant;
  }

  public async createMany(variants: ProductVariantModel[]): Promise<ProductVariantModel[]> {
    await this.variantDatasource.addManyVariants(variants);
    return variants;
  }

  public async update(variant: ProductVariantModel): Promise<ProductVariantModel> {
    await this.variantDatasource.updateVariant(variant);
    return variant;
  }

  public async findById(id: string): Promise<ProductVariantModel | undefined> {
    return await this.variantDatasource.findVariantById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.variantDatasource.deleteVariant(id);
  }

  public async findByProductId(productId: string): Promise<ProductVariantModel[]> {
    return await this.variantDatasource.findVariantsByProductId(productId);
  }
}
