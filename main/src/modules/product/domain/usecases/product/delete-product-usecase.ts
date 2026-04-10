import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { DeleteSearchDocumentsUsecase } from 'src/modules/search/domain/usecases/delete-search-documents-usecase';
import { ProductEventProducer } from '../../services/product-event-producer';

@Injectable()
export class DeleteProductUsecase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly deleteSearchDocumentsUsecase: DeleteSearchDocumentsUsecase,
    private readonly productEventProducer: ProductEventProducer,
  ) {}

  public async call(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new LogicalException(ErrorCode.PRODUCT_NOT_FOUND, 'Product not found.', undefined);
    }

    await this.productRepository.delete(id);
    await this.deleteSearchDocumentsUsecase.call([existing]);
    // Emit to AI queue for document deletion
    await this.productEventProducer.emitProductDeleted(existing.id, existing.name);
  }
}
