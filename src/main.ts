import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	app.enableCors({ origin: '*' });

	const config = new DocumentBuilder()
		.setTitle('DIAVERUM Backend API')
		.setDescription('Backend API Documentation for DIAVERUM BWD Project')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	app.enableShutdownHooks();

	await app.listen(process.env.PORT || 5001);

	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
