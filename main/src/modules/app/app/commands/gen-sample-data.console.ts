import { Command, Console } from 'nestjs-console';
import { BulkCreateCategoriesUsecase, CreateCategoryInput } from 'src/modules/category/domain/usecases/bulk-create-categories-usecase';
import {
  BulkCreateProductsUsecase,
  CreateProductInput,
  CreateProductImageInput,
  CreateProductOptionGroupInput,
  CreateProductOptionInput,
  CreateProductVariantInput,
} from 'src/modules/product/domain/usecases/product/bulk-create-products-usecase';
import { CategoryModel } from 'src/modules/category/domain/models/category-model';

@Console()
export class GenSampleDataConsole {
  constructor(
    private readonly bulkCreateCategoriesUsecase: BulkCreateCategoriesUsecase,
    private readonly bulkCreateProductsUsecase: BulkCreateProductsUsecase,
  ) {}

  @Command({
    command: 'gen:sample-data',
    description: 'Generate sample data for categories and products',
  })
  async handle(): Promise<void> {
    console.log('🚀 Starting sample data generation...\n');

    // ─── 1. Bulk create Categories ───────────────────────────────────────
    console.log('📂 Creating categories...');
    const categoryInputs = this.getCategoryInputs();
    const categories = await this.bulkCreateCategoriesUsecase.call(categoryInputs);

    // Create sub-categories of "Cà phê" after we have the parent ID
    const coffeeCategory = categories.find((c) => c.slug === 'ca-phe')!;
    const subCategoryInputs = this.getSubCategoryInputs(coffeeCategory.id);
    const subCategories = await this.bulkCreateCategoriesUsecase.call(subCategoryInputs);

    const allCategories = [...categories, ...subCategories];
    console.log(`   ✅ Created ${allCategories.length} categories\n`);

    // ─── 2. Bulk create Products per category ────────────────────────────
    console.log('📦 Creating products...');
    let totalProducts = 0;

    const productInputsByCategory = allCategories
      .map((cat) => this.getProductInputs(cat))
      .filter((inputs) => inputs.length > 0);

    for (const productInputs of productInputsByCategory) {
      const results = await this.bulkCreateProductsUsecase.call(productInputs);
      totalProducts += results.length;
      results.forEach((r) => console.log(`   ✅ ${r.product.name}`));
    }

    console.log('\n─────────────────────────────────────────');
    console.log('📊 Summary:');
    console.log(`   Categories:  ${allCategories.length}`);
    console.log(`   Products:    ${totalProducts}`);
    console.log('─────────────────────────────────────────');
    console.log('🎉 Sample data generation completed!\n');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Category inputs
  // ═══════════════════════════════════════════════════════════════════════

  private getCategoryInputs(): CreateCategoryInput[] {
    return [
      {
        name: 'Cà phê',
        slug: 'ca-phe',
        description: 'Các loại cà phê truyền thống và hiện đại',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
        parentId: undefined,
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Trà',
        slug: 'tra',
        description: 'Trà nóng và trà đá các loại',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        parentId: undefined,
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Sinh tố & Nước ép',
        slug: 'sinh-to-nuoc-ep',
        description: 'Sinh tố và nước ép trái cây tươi',
        imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
        parentId: undefined,
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Bánh ngọt',
        slug: 'banh-ngot',
        description: 'Bánh ngọt, bánh mì và các loại snack',
        imageUrl: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400',
        parentId: undefined,
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Đồ ăn nhẹ',
        slug: 'do-an-nhe',
        description: 'Các món ăn nhẹ đi kèm thức uống',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        parentId: undefined,
        sortOrder: 5,
        isActive: true,
      },
    ];
  }

  private getSubCategoryInputs(coffeeParentId: string): CreateCategoryInput[] {
    return [
      {
        name: 'Cà phê Việt Nam',
        slug: 'ca-phe-viet-nam',
        description: 'Cà phê phin truyền thống Việt Nam',
        imageUrl: undefined,
        parentId: coffeeParentId,
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Cà phê Espresso',
        slug: 'ca-phe-espresso',
        description: 'Các loại cà phê pha máy Espresso',
        imageUrl: undefined,
        parentId: coffeeParentId,
        sortOrder: 2,
        isActive: true,
      },
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Product inputs
  // ═══════════════════════════════════════════════════════════════════════

  private getProductInputs(category: CategoryModel): CreateProductInput[] {
    const map: Record<string, CreateProductInput[]> = {
      'ca-phe': this.getCoffeeProducts(category.id),
      'tra': this.getTeaProducts(category.id),
      'sinh-to-nuoc-ep': this.getSmoothieProducts(category.id),
      'banh-ngot': this.getPastryProducts(category.id),
      'do-an-nhe': this.getSnackProducts(category.id),
      'ca-phe-viet-nam': this.getVietnameseCoffeeProducts(category.id),
      'ca-phe-espresso': this.getEspressoProducts(category.id),
    };

    return map[category.slug] ?? [];
  }

  // ─── Cà phê ────────────────────────────────────────────────────────────

  private getCoffeeProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Bạc Xỉu',
        slug: 'bac-xiu',
        description: 'Cà phê sữa đặc với tỉ lệ sữa nhiều hơn, vị ngọt béo, thơm nhẹ.',
        shortDescription: 'Cà phê sữa ngọt béo',
        basePrice: 35000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 5,
        calories: 180,
        tags: ['cà phê', 'bạc xỉu', 'best-seller'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'BX-HOT', price: 35000, isDefault: true, sortOrder: 1 },
          { name: 'Đá', sku: 'BX-ICE', price: 39000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800', 'Bạc Xỉu', 1)],
        optionGroups: [
          this.makeSugarGroup(1),
        ],
      },
    ];
  }

  private getVietnameseCoffeeProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Cà Phê Sữa Đá',
        slug: 'ca-phe-sua-da',
        description: 'Cà phê phin truyền thống pha với sữa đặc, đá viên. Đậm đà, thơm nồng.',
        shortDescription: 'Cà phê phin sữa đá truyền thống',
        basePrice: 29000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 7,
        calories: 150,
        tags: ['cà phê', 'truyền thống', 'best-seller'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Nhỏ', sku: 'CPSD-S', price: 29000, isDefault: true, sortOrder: 1 },
          { name: 'Vừa', sku: 'CPSD-M', price: 35000, isDefault: false, sortOrder: 2 },
          { name: 'Lớn', sku: 'CPSD-L', price: 42000, isDefault: false, sortOrder: 3 },
        ]),
        images: [
          this.makeImage('https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800', 'Cà Phê Sữa Đá', 1),
          this.makeImage('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', 'Cà Phê Sữa Đá - Góc 2', 2),
        ],
        optionGroups: [
          this.makeSugarGroup(1),
          {
            name: 'Topping',
            isRequired: false,
            minSelections: 0,
            maxSelections: 3,
            sortOrder: 2,
            options: [
              { name: 'Trân châu trắng', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Thạch cà phê', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Kem cheese', additionalPrice: 15000, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
        ],
      },
      {
        categoryId,
        name: 'Cà Phê Đen Đá',
        slug: 'ca-phe-den-da',
        description: 'Cà phê đen nguyên chất, pha phin, vị đắng đậm đà.',
        shortDescription: 'Cà phê đen phin truyền thống',
        basePrice: 25000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 7,
        calories: 5,
        tags: ['cà phê', 'đen', 'truyền thống'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'CPDD-HOT', price: 25000, isDefault: true, sortOrder: 1 },
          { name: 'Đá', sku: 'CPDD-ICE', price: 29000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 'Cà Phê Đen Đá', 1)],
        optionGroups: [],
      },
      {
        categoryId,
        name: 'Cà Phê Trứng',
        slug: 'ca-phe-trung',
        description: 'Đặc sản Hà Nội - cà phê phin kết hợp kem trứng béo ngậy.',
        shortDescription: 'Cà phê trứng Hà Nội',
        basePrice: 39000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 10,
        calories: 220,
        tags: ['cà phê', 'trứng', 'đặc sản', 'hà nội'],
        sortOrder: 3,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'CPT-HOT', price: 39000, originalPrice: 45000, isDefault: true, sortOrder: 1 },
          { name: 'Đá xay', sku: 'CPT-BLEND', price: 45000, originalPrice: 50000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800', 'Cà Phê Trứng', 1)],
        optionGroups: [],
      },
    ];
  }

  private getEspressoProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Cappuccino',
        slug: 'cappuccino',
        description: 'Espresso kết hợp sữa tươi đánh bông mịn, rắc bột cacao.',
        shortDescription: 'Cappuccino ý cổ điển',
        basePrice: 49000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 5,
        calories: 120,
        tags: ['espresso', 'cappuccino', 'ý'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Nhỏ (8oz)', sku: 'CAP-S', price: 49000, isDefault: true, sortOrder: 1 },
          { name: 'Vừa (12oz)', sku: 'CAP-M', price: 55000, isDefault: false, sortOrder: 2 },
          { name: 'Lớn (16oz)', sku: 'CAP-L', price: 62000, isDefault: false, sortOrder: 3 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1534778101976-62847782c213?w=800', 'Cappuccino', 1)],
        optionGroups: [
          {
            name: 'Loại sữa',
            isRequired: true,
            minSelections: 1,
            maxSelections: 1,
            sortOrder: 1,
            options: [
              { name: 'Sữa tươi', additionalPrice: 0, isDefault: true, isActive: true, sortOrder: 1 },
              { name: 'Sữa yến mạch', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Sữa hạnh nhân', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
          {
            name: 'Shot espresso',
            isRequired: false,
            minSelections: 0,
            maxSelections: 1,
            sortOrder: 2,
            options: [
              { name: 'Thêm 1 shot', additionalPrice: 15000, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Thêm 2 shot', additionalPrice: 25000, isDefault: false, isActive: true, sortOrder: 2 },
            ],
          },
        ],
      },
      {
        categoryId,
        name: 'Latte',
        slug: 'latte',
        description: 'Espresso hòa quyện cùng sữa tươi nóng, lớp foam mỏng nhẹ.',
        shortDescription: 'Latte sữa tươi mịn màng',
        basePrice: 49000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 5,
        calories: 150,
        tags: ['espresso', 'latte'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'LAT-HOT', price: 49000, isDefault: true, sortOrder: 1 },
          { name: 'Đá', sku: 'LAT-ICE', price: 52000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800', 'Latte', 1)],
        optionGroups: [
          {
            name: 'Vị syrup',
            isRequired: false,
            minSelections: 0,
            maxSelections: 1,
            sortOrder: 1,
            options: [
              { name: 'Vanilla', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Caramel', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Hazelnut', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
        ],
      },
      {
        categoryId,
        name: 'Americano',
        slug: 'americano',
        description: 'Espresso pha loãng với nước nóng, giữ nguyên hương vị đậm đà.',
        shortDescription: 'Americano thanh nhẹ',
        basePrice: 39000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 3,
        calories: 10,
        tags: ['espresso', 'americano', 'đen'],
        sortOrder: 3,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'AMR-HOT', price: 39000, isDefault: true, sortOrder: 1 },
          { name: 'Đá', sku: 'AMR-ICE', price: 42000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800', 'Americano', 1)],
        optionGroups: [],
      },
    ];
  }

  // ─── Trà ────────────────────────────────────────────────────────────────

  private getTeaProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Trà Sen Vàng',
        slug: 'tra-sen-vang',
        description: 'Trà ướp hương sen thanh mát, hậu vị ngọt nhẹ tự nhiên.',
        shortDescription: 'Trà hương sen thanh mát',
        basePrice: 39000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 5,
        calories: 60,
        tags: ['trà', 'sen', 'best-seller'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Nóng', sku: 'TSV-HOT', price: 39000, isDefault: true, sortOrder: 1 },
          { name: 'Đá', sku: 'TSV-ICE', price: 42000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800', 'Trà Sen Vàng', 1)],
        optionGroups: [
          {
            name: 'Topping',
            isRequired: false,
            minSelections: 0,
            maxSelections: 2,
            sortOrder: 1,
            options: [
              { name: 'Hạt sen', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Trân châu trắng', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Thạch ổi', additionalPrice: 8000, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
        ],
      },
      {
        categoryId,
        name: 'Trà Đào Cam Sả',
        slug: 'tra-dao-cam-sa',
        description: 'Trà đào kết hợp cam tươi và sả, vị chua ngọt sảng khoái.',
        shortDescription: 'Trà trái cây chua ngọt',
        basePrice: 45000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 5,
        calories: 90,
        tags: ['trà', 'đào', 'cam', 'best-seller'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Đá', sku: 'TDCS-ICE', price: 45000, isDefault: true, sortOrder: 1 },
          { name: 'Nóng', sku: 'TDCS-HOT', price: 42000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800', 'Trà Đào Cam Sả', 1)],
        optionGroups: [],
      },
      {
        categoryId,
        name: 'Trà Sữa Trân Châu',
        slug: 'tra-sua-tran-chau',
        description: 'Trà sữa đậm đà kết hợp trân châu đen dẻo dai.',
        shortDescription: 'Trà sữa trân châu cổ điển',
        basePrice: 42000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 5,
        calories: 250,
        tags: ['trà sữa', 'trân châu'],
        sortOrder: 3,
        variants: this.makeVariants([
          { name: 'Vừa', sku: 'TSTC-M', price: 42000, isDefault: true, sortOrder: 1 },
          { name: 'Lớn', sku: 'TSTC-L', price: 52000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1558857563-b371033873b8?w=800', 'Trà Sữa Trân Châu', 1)],
        optionGroups: [
          this.makeSugarGroup(1),
          {
            name: 'Mức đá',
            isRequired: true,
            minSelections: 1,
            maxSelections: 1,
            sortOrder: 2,
            options: [
              { name: '100% đá', additionalPrice: 0, isDefault: true, isActive: true, sortOrder: 1 },
              { name: '70% đá', additionalPrice: 0, isDefault: false, isActive: true, sortOrder: 2 },
              { name: '50% đá', additionalPrice: 0, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
        ],
      },
    ];
  }

  // ─── Sinh tố & Nước ép ─────────────────────────────────────────────────

  private getSmoothieProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Sinh Tố Bơ',
        slug: 'sinh-to-bo',
        description: 'Sinh tố bơ sáp béo ngậy, thêm sữa đặc, đá xay mịn.',
        shortDescription: 'Sinh tố bơ béo ngậy',
        basePrice: 45000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 5,
        calories: 300,
        tags: ['sinh tố', 'bơ', 'healthy'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Vừa', sku: 'STB-M', price: 45000, isDefault: true, sortOrder: 1 },
          { name: 'Lớn', sku: 'STB-L', price: 55000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800', 'Sinh Tố Bơ', 1)],
        optionGroups: [],
      },
      {
        categoryId,
        name: 'Nước Ép Cam',
        slug: 'nuoc-ep-cam',
        description: 'Nước ép cam tươi 100%, không thêm đường, giàu vitamin C.',
        shortDescription: 'Nước ép cam tươi nguyên chất',
        basePrice: 35000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 4,
        calories: 80,
        tags: ['nước ép', 'cam', 'vitamin C', 'healthy'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Vừa', sku: 'NEC-M', price: 35000, isDefault: true, sortOrder: 1 },
          { name: 'Lớn', sku: 'NEC-L', price: 45000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800', 'Nước Ép Cam', 1)],
        optionGroups: [],
      },
      {
        categoryId,
        name: 'Sinh Tố Xoài',
        slug: 'sinh-to-xoai',
        description: 'Sinh tố xoài chín mọng, ngọt tự nhiên, bổ sung sữa chua.',
        shortDescription: 'Sinh tố xoài tươi',
        basePrice: 42000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 5,
        calories: 200,
        tags: ['sinh tố', 'xoài', 'trái cây'],
        sortOrder: 3,
        variants: this.makeVariants([
          { name: 'Vừa', sku: 'STX-M', price: 42000, isDefault: true, sortOrder: 1 },
          { name: 'Lớn', sku: 'STX-L', price: 52000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800', 'Sinh Tố Xoài', 1)],
        optionGroups: [],
      },
    ];
  }

  // ─── Bánh ngọt ──────────────────────────────────────────────────────────

  private getPastryProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Bánh Croissant Bơ',
        slug: 'banh-croissant-bo',
        description: 'Bánh croissant giòn xốp, nhiều lớp, thơm mùi bơ Pháp.',
        shortDescription: 'Croissant bơ Pháp',
        basePrice: 35000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 3,
        calories: 280,
        tags: ['bánh', 'croissant', 'pháp'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Croissant bơ', sku: 'CRS-BTR', price: 35000, isDefault: true, sortOrder: 1 },
          { name: 'Croissant socola', sku: 'CRS-CHO', price: 39000, isDefault: false, sortOrder: 2 },
          { name: 'Croissant hạnh nhân', sku: 'CRS-ALM', price: 42000, isDefault: false, sortOrder: 3 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800', 'Bánh Croissant Bơ', 1)],
        optionGroups: [],
      },
      {
        categoryId,
        name: 'Bánh Tiramisu',
        slug: 'banh-tiramisu',
        description: 'Tiramisu Ý cổ điển, lớp kem mascarpone mịn, thấm cà phê đậm.',
        shortDescription: 'Tiramisu cổ điển',
        basePrice: 55000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 2,
        calories: 350,
        tags: ['bánh', 'tiramisu', 'ý'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Miếng nhỏ', sku: 'TRM-S', price: 55000, isDefault: true, sortOrder: 1 },
          { name: 'Miếng lớn', sku: 'TRM-L', price: 75000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800', 'Bánh Tiramisu', 1)],
        optionGroups: [],
      },
    ];
  }

  // ─── Đồ ăn nhẹ ──────────────────────────────────────────────────────────

  private getSnackProducts(categoryId: string): CreateProductInput[] {
    return [
      {
        categoryId,
        name: 'Sandwich Gà Nướng',
        slug: 'sandwich-ga-nuong',
        description: 'Sandwich bánh mì nướng giòn, nhân gà nướng, rau tươi, sốt mayo.',
        shortDescription: 'Sandwich gà nướng giòn',
        basePrice: 55000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
        isActive: true,
        isFeatured: true,
        preparationTime: 8,
        calories: 420,
        tags: ['sandwich', 'gà', 'ăn sáng'],
        sortOrder: 1,
        variants: this.makeVariants([
          { name: 'Thường', sku: 'SWG-R', price: 55000, isDefault: true, sortOrder: 1 },
          { name: 'Combo (kèm nước)', sku: 'SWG-CMB', price: 75000, originalPrice: 84000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', 'Sandwich Gà Nướng', 1)],
        optionGroups: [
          {
            name: 'Thêm nhân',
            isRequired: false,
            minSelections: 0,
            maxSelections: 2,
            sortOrder: 1,
            options: [
              { name: 'Thêm trứng', additionalPrice: 8000, isDefault: false, isActive: true, sortOrder: 1 },
              { name: 'Thêm phô mai', additionalPrice: 10000, isDefault: false, isActive: true, sortOrder: 2 },
              { name: 'Thêm bơ', additionalPrice: 5000, isDefault: false, isActive: true, sortOrder: 3 },
            ],
          },
        ],
      },
      {
        categoryId,
        name: 'Khoai Tây Chiên',
        slug: 'khoai-tay-chien',
        description: 'Khoai tây chiên giòn rụm, ăn kèm tương cà và mayo.',
        shortDescription: 'Khoai tây chiên giòn',
        basePrice: 35000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        isActive: true,
        isFeatured: false,
        preparationTime: 6,
        calories: 380,
        tags: ['khoai tây', 'chiên', 'snack'],
        sortOrder: 2,
        variants: this.makeVariants([
          { name: 'Phần nhỏ', sku: 'KTC-S', price: 35000, isDefault: true, sortOrder: 1 },
          { name: 'Phần lớn', sku: 'KTC-L', price: 49000, isDefault: false, sortOrder: 2 },
        ]),
        images: [this.makeImage('https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800', 'Khoai Tây Chiên', 1)],
        optionGroups: [],
      },
    ];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Builder helpers (reduce boilerplate in data definitions)
  // ═══════════════════════════════════════════════════════════════════════

  private makeVariants(
    defs: Array<{ name: string; sku: string; price: number; originalPrice?: number; isDefault: boolean; sortOrder: number }>,
    stockQuantity = 100,
  ): CreateProductVariantInput[] {
    return defs.map((d) => ({
      name: d.name,
      sku: d.sku,
      price: d.price,
      originalPrice: d.originalPrice,
      stockQuantity,
      isDefault: d.isDefault,
      isActive: true,
      sortOrder: d.sortOrder,
    }));
  }

  private makeImage(imageUrl: string, altText: string, sortOrder: number): CreateProductImageInput {
    return { imageUrl, altText, sortOrder };
  }

  private makeSugarGroup(sortOrder: number): CreateProductOptionGroupInput {
    return {
      name: 'Mức đường',
      isRequired: false,
      minSelections: 0,
      maxSelections: 1,
      sortOrder,
      options: [
        { name: '100% đường', additionalPrice: 0, isDefault: true, isActive: true, sortOrder: 1 },
        { name: '70% đường', additionalPrice: 0, isDefault: false, isActive: true, sortOrder: 2 },
        { name: '50% đường', additionalPrice: 0, isDefault: false, isActive: true, sortOrder: 3 },
        { name: '0% đường', additionalPrice: 0, isDefault: false, isActive: true, sortOrder: 4 },
      ] as CreateProductOptionInput[],
    };
  }
}
