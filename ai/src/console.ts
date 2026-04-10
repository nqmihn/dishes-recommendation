import { BootstrapConsole } from 'nestjs-console';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './modules/app/app.module';
import { setupInjector } from './injector';

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});
initializeTransactionalContext();

bootstrap.init().then(async (app) => {
  try {
    await app.init();
    setupInjector(app);
    await bootstrap.boot();
    await app.close();
    process.exit(0);
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
