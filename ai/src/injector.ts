import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';

class Injector {
  constructor(private readonly app: INestApplicationContext) {}

  resolve<T>(type: Type<T> | string): T {
    return this.app.get(type);
  }
}

let injector: Injector;

export function setupInjector(app: INestApplicationContext) {
  injector = new Injector(app);
}

export function getInjector(): Injector {
  return injector;
}
