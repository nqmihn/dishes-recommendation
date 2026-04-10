import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category-entity';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { PageList } from 'src/core/models/page-list';
import { PageParams } from 'src/core/models/page-params';
import { SortParams } from 'src/core/models/sort-params';
import { CategoryModel } from '../../domain/models/category-model';
import { CategorySearchParams } from '../../domain/models/category-search-params';

@Injectable()
export class CategoryDatasource {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepo: Repository<CategoryEntity>) {}

  public async add(category: CategoryModel): Promise<void> {
    const entity = this.categoryRepo.create({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.imageUrl,
      parent_id: category.parentId,
      sort_order: category.sortOrder,
      is_active: category.isActive,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    });

    await this.categoryRepo.insert(entity);
  }

  public async addMany(categories: CategoryModel[]): Promise<void> {
    if (categories.length === 0) return;
    const entities = categories.map((category) =>
      this.categoryRepo.create({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.imageUrl,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_active: category.isActive,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      }),
    );
    await this.categoryRepo.insert(entities);
  }

  public async update(category: CategoryModel): Promise<void> {
    await this.categoryRepo.update(category.id, {
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.imageUrl,
      parent_id: category.parentId,
      sort_order: category.sortOrder,
      is_active: category.isActive,
      updated_at: category.updatedAt,
    });
  }

  public async findById(id: string): Promise<CategoryModel | undefined> {
    const entity = await this.categoryRepo.findOne({ where: { id } });
    return entity?.toModel();
  }

  public async findBySlug(slug: string): Promise<CategoryModel | undefined> {
    const entity = await this.categoryRepo.findOne({ where: { slug } });
    return entity?.toModel();
  }

  public async list(
    pageParams: PageParams,
    sortParams: SortParams,
    searchParams: CategorySearchParams,
  ): Promise<PageList<CategoryModel>> {
    const condition: FindOptionsWhere<CategoryEntity> = {};
    const orderBy: Record<string, any> = {};

    orderBy[sortParams.sort] = sortParams.dir;

    if (searchParams.isActive !== undefined) {
      condition.is_active = searchParams.isActive;
    }

    if (searchParams.parentId !== undefined) {
      condition.parent_id = searchParams.parentId || IsNull() as any;
    }

    const query = this.categoryRepo.createQueryBuilder('category').setFindOptions({
      where: searchParams.search
        ? [
            { ...condition, name: ILike(`%${searchParams.search}%`) },
            { ...condition, slug: ILike(`%${searchParams.search}%`) },
          ]
        : condition,
      skip: pageParams.limit * (pageParams.page - 1),
      take: pageParams.limit,
      order: orderBy,
    });

    let totalCount;
    if (pageParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    let categories: CategoryEntity[] = [];
    if (!pageParams.onlyCount) {
      categories = await query.getMany();
    }

    return new PageList(
      pageParams.page,
      totalCount,
      categories.map((c) => c.toModel()),
    );
  }

  public async delete(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }

  public async findByParentId(parentId: string | undefined): Promise<CategoryModel[]> {
    const condition: FindOptionsWhere<CategoryEntity> = {};

    if (parentId) {
      condition.parent_id = parentId;
    } else {
      condition.parent_id = IsNull() as any;
    }

    const entities = await this.categoryRepo.find({
      where: condition,
      order: { sort_order: 'ASC', name: 'ASC' },
    });

    return entities.map((e) => e.toModel());
  }

  public async findTreeByParentId(parentId: string | undefined): Promise<CategoryModel[]> {
    const roots = await this.findByParentId(parentId);
    const result: CategoryModel[] = [];

    for (const root of roots) {
      const children = await this.findTreeByParentId(root.id);
      result.push(root.copyWith({ children }));
    }

    return result;
  }
}
