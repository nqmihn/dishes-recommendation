import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOptionGroupEntity } from '../entities/product-option-group-entity';
import { ProductOptionGroupModel } from '../../domain/models/product-option-group-model';

@Injectable()
export class ProductOptionGroupDatasource {
  constructor(
    @InjectRepository(ProductOptionGroupEntity) private readonly optionGroupRepo: Repository<ProductOptionGroupEntity>,
  ) {}

  public async addOptionGroup(group: ProductOptionGroupModel): Promise<void> {
    const entity = this.optionGroupRepo.create({
      id: group.id,
      product_id: group.productId,
      name: group.name,
      is_required: group.isRequired,
      min_selections: group.minSelections,
      max_selections: group.maxSelections,
      sort_order: group.sortOrder,
      created_at: group.createdAt,
      updated_at: group.updatedAt,
    });

    await this.optionGroupRepo.insert(entity);
  }

  public async addManyOptionGroups(groups: ProductOptionGroupModel[]): Promise<void> {
    if (groups.length === 0) return;
    const entities = groups.map((group) =>
      this.optionGroupRepo.create({
        id: group.id,
        product_id: group.productId,
        name: group.name,
        is_required: group.isRequired,
        min_selections: group.minSelections,
        max_selections: group.maxSelections,
        sort_order: group.sortOrder,
        created_at: group.createdAt,
        updated_at: group.updatedAt,
      }),
    );
    await this.optionGroupRepo.insert(entities);
  }

  public async updateOptionGroup(group: ProductOptionGroupModel): Promise<void> {
    await this.optionGroupRepo.update(group.id, {
      name: group.name,
      is_required: group.isRequired,
      min_selections: group.minSelections,
      max_selections: group.maxSelections,
      sort_order: group.sortOrder,
      updated_at: group.updatedAt,
    });
  }

  public async findOptionGroupById(id: string): Promise<ProductOptionGroupModel | undefined> {
    const entity = await this.optionGroupRepo.findOne({ where: { id } });
    return entity?.toModel();
  }

  public async deleteOptionGroup(id: string): Promise<void> {
    await this.optionGroupRepo.delete(id);
  }

  public async findOptionGroupsByProductId(productId: string): Promise<ProductOptionGroupModel[]> {
    const entities = await this.optionGroupRepo.find({
      where: { product_id: productId },
      order: { sort_order: 'ASC' },
    });
    return entities.map((e) => e.toModel());
  }
}
