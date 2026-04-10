import { DomainModel } from '../../../../core/models/domain-model';

export abstract class SearchableModel extends DomainModel {
  protected readonly searchRelations: string[] = [];

  public static getFilterableKeys(): Record<string, any> | undefined {
    return undefined;
  }

  public abstract getSearchDocument({ isRelation }: { isRelation?: boolean }): Record<string, any>;

  public abstract getSearchIndexName(): string;

  public toSearchJson(): Record<string, any> {
    const searchDocument = this.getSearchDocument({ isRelation: false });
    this.searchRelations.forEach((relation: string) => {
      Object.assign(searchDocument, this.getSearchDocumentByRelations(relation));
    });

    return searchDocument;
  }

  private getSearchDocumentByRelations(relations: string): Record<string, any> {
    const searchDocument: Record<string, any> = {};

    const splitRelations = relations.split('.');
    const firstRelation = splitRelations[0];
    const remainRelations =
      splitRelations.length > 1 ? splitRelations.slice(1, splitRelations.length).join('.') : undefined;
    const relationModel = this[firstRelation as keyof this];
    if (relationModel !== undefined && relationModel !== null) {
      if (Array.isArray(relationModel)) {
        Object.assign(
          searchDocument,
          this.getSearchDocumentByModels(relationModel as SearchableModel[], remainRelations, firstRelation),
        );
      } else {
        Object.assign(
          searchDocument,
          this.getSearchDocumentByModel(relationModel as unknown as SearchableModel, remainRelations, firstRelation),
        );
      }
    }

    return searchDocument;
  }

  private getSearchDocumentByModels(
    models: SearchableModel[],
    relations: string | undefined,
    prefix: string | number | undefined,
  ): Record<string, any> {
    const searchDocument: Record<string, any> = {};
    models.forEach((model, index) => {
      Object.assign(searchDocument, this.getSearchDocumentByModel(model, relations, `${prefix}_${index}`));
    });

    return searchDocument;
  }

  private getSearchDocumentByModel(
    model: SearchableModel,
    relations: string | undefined,
    prefix: string | number | undefined,
  ): Record<string, any> {
    const searchDocument = relations
      ? model.getSearchDocumentByRelations(relations)
      : model.getSearchDocument({ isRelation: true });

    return this.normalizeSearchDocument(searchDocument, prefix);
  }

  private normalizeSearchDocument(
    document: Record<string, any>,
    prefix: string | number | undefined,
  ): Record<string, any> {
    const normalizedPrefix = prefix === undefined ? '' : `${prefix}_`;
    return Object.keys(document).reduce(
      (prefixedObject: Record<string, any>, key: string) => ({
        ...prefixedObject,
        [`${normalizedPrefix}${key}`]: document[key],
      }),
      {},
    );
  }
}
