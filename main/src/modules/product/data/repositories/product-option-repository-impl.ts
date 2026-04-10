import { Injectable } from '@nestjs/common';
import { ProductOptionRepository } from '../../domain/repositories/product-option-repository';
import { ProductOptionDatasource } from '../datasources/product-option-datasource';
import { ProductOptionModel } from '../../domain/models/product-option-model';

@Injectable()
export class ProductOptionRepositoryImpl extends ProductOptionRepository {
  constructor(private readonly optionDatasource: ProductOptionDatasource) {
    super();
  }

  public async create(option: ProductOptionModel): Promise<ProductOptionModel> {
    await this.optionDatasource.addOption(option);
    return option;
  }

  public async createMany(options: ProductOptionModel[]): Promise<ProductOptionModel[]> {
    await this.optionDatasource.addManyOptions(options);
    return options;
  }

  public async update(option: ProductOptionModel): Promise<ProductOptionModel> {
    await this.optionDatasource.updateOption(option);
    return option;
  }

  public async findById(id: string): Promise<ProductOptionModel | undefined> {
    return await this.optionDatasource.findOptionById(id);
  }

  public async delete(id: string): Promise<void> {
    await this.optionDatasource.deleteOption(id);
  }

  public async findByGroupId(groupId: string): Promise<ProductOptionModel[]> {
    return await this.optionDatasource.findOptionsByGroupId(groupId);
  }
}
