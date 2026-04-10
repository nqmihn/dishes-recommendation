import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { parseBoolean, readJsonFile } from './utils';

/**
 * Sets up Swagger for the given NestJS application if enabled in the configuration.
 *
 * @param app - The NestJS application instance.
 * @returns A promise that resolves when Swagger setup is complete.
 */
export async function setupSwagger(app: INestApplication) {
  if (parseBoolean(app.get(ConfigService).get<boolean>('swagger.enabled'))) {
    const packageApp = await readJsonFile('package.json');

    const config = new DocumentBuilder()
      .setTitle(`${app.get(ConfigService).get<string>('swagger.title')}`)
      .setDescription(`${app.get(ConfigService).get<string>('swagger.description')}`)
      .setVersion(packageApp.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${app.get(ConfigService).get<string>('swagger.path')}`, app, document);
  }
}
