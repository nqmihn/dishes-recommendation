import { Injectable } from '@nestjs/common';
import { ProductOptionGroupRepository } from '../../domain/repositories/product-option-group-repository';
import { ProductOptionGroupDatasource } from '../datasources/product-option-group-datasource';
import { ProductOptionGroupModel } from '../../domain/models/product-option-group-model';

@Injectable()
export class ProductOptionGroupRepositoryImpl extends ProductOptionGroupRepository {
  constructor(private readonly optionGroupDatasource: ProductOptionGroupDatasource) {
    super();
  }

  public async create(group: ProductOptionGroupModel): Promise<ProductOptionGroupModel> {
    await this.optionGroupDatasource.addOptionGroup(group);
    return group;
  }

  public async createMany(groups: ProductOptionGroupModel[]): Promise<ProductOptionGroupModel[]> {
    await this.optionGroupDatasource.addManyOptionGroups(groups);
    return groups;
  }

  public async update(group: ProductOptionGroupModel): Promise<ProductOptionGroupModel> {
    await this.optionGroupDatasource.updateOptionGroup(group);
    return group;
  }

  public async findById(id: string): Promise<ProductOptionGroupModel | undefined> {
    return await this.optionGroupDatasource.findOptionGroupById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.optionGroupDatasource.deleteOptionGroup(id);
  }

  public async findByProductId(productId: string): Promise<ProductOptionGroupModel[]> {
    return await this.optionGroupDatasource.findOptionGroupsByProductId(productId);
  }
}
