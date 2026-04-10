import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '../entities/product-variant-entity';
import { ProductVariantModel } from '../../domain/models/product-variant-model';

@Injectable()
export class ProductVariantDatasource {
  constructor(
    @InjectRepository(ProductVariantEntity) private readonly variantRepo: Repository<ProductVariantEntity>,
  ) {}

  public async addVariant(variant: ProductVariantModel): Promise<void> {
    const entity = this.variantRepo.create({
      id: variant.id,
      product_id: variant.productId,
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      original_price: variant.originalPrice,
      stock_quantity: variant.stockQuantity,
      is_default: variant.isDefault,
      is_active: variant.isActive,
      sort_order: variant.sortOrder,
      created_at: variant.createdAt,
      updated_at: variant.updatedAt,
    });

    await this.variantRepo.insert(entity);
  }

  public async addManyVariants(variants: ProductVariantModel[]): Promise<void> {
    if (variants.length === 0) return;
    const entities = variants.map((variant) =>
      this.variantRepo.create({
        id: variant.id,
        product_id: variant.productId,
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        original_price: variant.originalPrice,
        stock_quantity: variant.stockQuantity,
        is_default: variant.isDefault,
        is_active: variant.isActive,
        sort_order: variant.sortOrder,
        created_at: variant.createdAt,
        updated_at: variant.updatedAt,
      }),
    );
    await this.variantRepo.insert(entities);
  }

  public async updateVariant(variant: ProductVariantModel): Promise<void> {
    await this.variantRepo.update(variant.id, {
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      original_price: variant.originalPrice,
      stock_quantity: variant.stockQuantity,
      is_default: variant.isDefault,
      is_active: variant.isActive,
      sort_order: variant.sortOrder,
      updated_at: variant.updatedAt,
    });
  }

  public async findVariantById(id: string): Promise<ProductVariantModel | undefined> {
    const entity = await this.variantRepo.findOne({ where: { id } });
    return entity?.toModel();
  }

  public async deleteVariant(id: string): Promise<void> {
    await this.variantRepo.delete(id);
  }

  public async findVariantsByProductId(productId: string): Promise<ProductVariantModel[]> {
    const entities = await this.variantRepo.find({
      where: { product_id: productId },
      order: { sort_order: 'ASC' },
    });
    return entities.map((e) => e.toModel());
  }
}
