import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOptionEntity } from '../entities/product-option-entity';
import { ProductOptionModel } from '../../domain/models/product-option-model';

@Injectable()
export class ProductOptionDatasource {
  constructor(
    @InjectRepository(ProductOptionEntity) private readonly optionRepo: Repository<ProductOptionEntity>,
  ) {}

  public async addOption(option: ProductOptionModel): Promise<void> {
    const entity = this.optionRepo.create({
      id: option.id,
      option_group_id: option.optionGroupId,
      name: option.name,
      additional_price: option.additionalPrice,
      is_default: option.isDefault,
      is_active: option.isActive,
      sort_order: option.sortOrder,
      created_at: option.createdAt,
      updated_at: option.updatedAt,
    });

    await this.optionRepo.insert(entity);
  }

  public async addManyOptions(options: ProductOptionModel[]): Promise<void> {
    if (options.length === 0) return;
    const entities = options.map((option) =>
      this.optionRepo.create({
        id: option.id,
        option_group_id: option.optionGroupId,
        name: option.name,
        additional_price: option.additionalPrice,
        is_default: option.isDefault,
        is_active: option.isActive,
        sort_order: option.sortOrder,
        created_at: option.createdAt,
        updated_at: option.updatedAt,
      }),
    );
    await this.optionRepo.insert(entities);
  }

  public async updateOption(option: ProductOptionModel): Promise<void> {
    await this.optionRepo.update(option.id, {
      name: option.name,
      additional_price: option.additionalPrice,
      is_default: option.isDefault,
      is_active: option.isActive,
      sort_order: option.sortOrder,
      updated_at: option.updatedAt,
    });
  }

  public async findOptionById(id: string): Promise<ProductOptionModel | undefined> {
    const entity = await this.optionRepo.findOne({ where: { id } });
    return entity?.toModel();
  }

  public async deleteOption(id: string): Promise<void> {
    await this.optionRepo.delete(id);
  }

  public async findOptionsByGroupId(groupId: string): Promise<ProductOptionModel[]> {
    const entities = await this.optionRepo.find({
      where: { option_group_id: groupId },
      order: { sort_order: 'ASC' },
    });
    return entities.map((e) => e.toModel());
  }
}
