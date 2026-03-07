import type { LedMatrixInstance } from 'rpi-led-matrix';
import { TestMatrix } from './test-matrix.ts';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const getMatrix = (): Promise<LedMatrixInstance> => {
	if (process.platform === 'linux') {
		return getRealMatrix();
	} else {
		return getTestMatrix();
	}
}

const getRealMatrix = async () => {
	const { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } = require('rpi-led-matrix');

	const matrix = new LedMatrix({
		...LedMatrix.defaultMatrixOptions(),
		rows: 32,
		cols: 64,
		chainLength: 2,
		hardwareMapping: GpioMapping.AdafruitHat,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.VZ,
		})

	}, {
		...LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 1
	});


	return matrix;
};

const getTestMatrix = (): Promise<LedMatrixInstance> => {
	const matrix = new TestMatrix() as LedMatrixInstance;

	return Promise.resolve(matrix);
}