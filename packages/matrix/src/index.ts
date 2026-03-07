import type { LedMatrixInstance } from 'rpi-led-matrix';
import { TestMatrix } from './test-matrix';
import { getRealMatrix } from './matrix';

export const getMatrix = (): Promise<LedMatrixInstance> => {
	if (process.platform === 'linux') {
		return getRealMatrix();
	} else {
		return getTestMatrix();
	}
}



const getTestMatrix = (): Promise<LedMatrixInstance> => {
	const matrix = new TestMatrix() as LedMatrixInstance;

	return Promise.resolve(matrix);
}