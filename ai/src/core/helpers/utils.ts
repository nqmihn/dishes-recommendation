import { PageList } from '../models/page-list';
import { DomainModel } from '../models/domain-model';
import { promises as fs, readFileSync } from 'fs';
import { join } from 'path';
import { SelectQueryBuilder } from 'typeorm';
import { Type } from '@nestjs/common';
import {
  inheritPropertyInitializers,
  inheritTransformationMetadata,
  inheritValidationMetadata,
} from '@nestjs/mapped-types';
import Handlebars from 'handlebars';
import { clonePluginMetadataFactory } from '@nestjs/swagger/dist/type-helpers/mapped-types.utils';
import { mapValues } from 'lodash';
import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { ApiProperty } from '@nestjs/swagger';
import { METADATA_FACTORY_NAME } from '@nestjs/swagger/dist/plugin/plugin-constants';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SkipUndefined } from '../decorators/skip-undefined';

export function throwError(errorMessage = ''): never {
  throw new Error(errorMessage);
}

export const normalizeResponseData = (result: any, showHidden = false): any => {
  let data: any = result;
  if (result instanceof PageList) {
    data = result.data.map((model) => model.toJson(showHidden));
  } else if (result instanceof DomainModel) {
    data = result.toJson(showHidden);
  } else if (Array.isArray(result)) {
    data = result.map((item) => {
      if (item instanceof DomainModel) {
        return item.toJson(showHidden);
      }
      return item;
    });
  }
  return data ?? null;
};

export const parseBoolean = (val: string | boolean | number | undefined, strict = true): boolean | undefined | null => {
  if ((val === undefined || val === null) && !strict) {
    return val;
  }
  const s = val && val.toString().toLowerCase().trim();
  return s == 'true' || s == '1';
};

export const readJsonFile = async (fileName: string): Promise<any> => {
  const data = await fs.readFile(join(process.cwd(), fileName));
  const stringData = data.toString();
  return JSON.parse(stringData);
};

export const isExistsQuery = (query: string) => `EXISTS(${query}) AS "exists"`;

// TODO: remove this once it is provided by TypeORM (in case that ever happens)
declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SelectQueryBuilder<Entity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists<T>(): Promise<boolean>;
  }
}

SelectQueryBuilder.prototype.exists = async function (): Promise<boolean> {
  const result = await this.select(isExistsQuery(this.getQuery())).where('').getRawOne();
  return result?.exists;
};

const modelPropertiesAccessor = new ModelPropertiesAccessor();

export function PartialWithoutNullType<T>(classRef: Type<T>): Type<Partial<T>> {
  const fields = modelPropertiesAccessor.getModelProperties(classRef.prototype);

  abstract class PartialTypeClass {
    constructor() {
      inheritPropertyInitializers(this, classRef);
    }
  }

  inheritValidationMetadata(classRef, PartialTypeClass);
  inheritTransformationMetadata(classRef, PartialTypeClass);

  clonePluginMetadataFactory(PartialTypeClass as Type<unknown>, classRef.prototype, (metadata: Record<string, any>) =>
    mapValues(metadata, (item: any) => ({ ...item, required: false })),
  );

  fields.forEach((key) => {
    const metadata = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, classRef.prototype, key) || {};

    const decoratorFactory = ApiProperty({
      ...metadata,
      required: false,
    });
    decoratorFactory(PartialTypeClass.prototype, key);
    applySkipUndefined(PartialTypeClass, key);
  });

  if (PartialTypeClass[METADATA_FACTORY_NAME as keyof PartialTypeClass]) {
    const pluginFields = Object.keys(PartialTypeClass[METADATA_FACTORY_NAME as keyof PartialTypeClass]);
    pluginFields.forEach((key) => applySkipUndefined(PartialTypeClass, key));
  }

  return PartialTypeClass as Type<Partial<T>>;
}

function applySkipUndefined(targetClass: any, key: string) {
  const decoratorFactory = SkipUndefined();
  decoratorFactory(targetClass.prototype, key);
}

export function parseNullToUndefined(value: any): any {
  return value === null ? undefined : value;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomNumber(0, characters.length - 1));
  }

  return result;
}

export function intersectionArray(a: any[], b: any[]): any[] {
  return a.filter((value) => {
    return b.indexOf(value) !== -1;
  });
}

export function renderTemplate(path: string, data: object): string {
  const file = readFileSync(path);

  const renderedTemplate = Handlebars.compile(file.toString());

  return renderedTemplate(data);
}

export function usleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isSubarray<T>(a: T[], b: T[]): boolean {
  const setA = new Set(a);
  return b.every((item) => setA.has(item));
}

export function shuffleRecords(records: any[]): any[] {
  for (let i = records.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [records[i], records[j]] = [records[j], records[i]];
  }
  return records;
}
