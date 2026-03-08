import type { LedMatrixInstance } from 'rpi-led-matrix';
import type { Painter } from 'rpi-led-matrix-painter';
import { TestMatrix } from './test-matrix';
import { getRealMatrix } from './matrix';
import { getPainterMatrix as getPainterMatrixInternal } from './painter-matrix';

export const getBasicMatrix = (): Promise<LedMatrixInstance> => {
	if (process.platform === 'linux') {
		return getRealMatrix();
	} else {
		return getTestMatrix();
	}
}

export const getPainterMatrix = async (): Promise<{ matrix: Painter, DrawMode: any }> => {
	if (process.platform === 'linux') {
		return getPainterMatrixInternal();
	} else {
		const matrix = await getTestMatrix();
		return { matrix, DrawMode: {}, Board: {} };
	}
}



const getTestMatrix = (): Promise<LedMatrixInstance> => {
	const matrix = new TestMatrix() as LedMatrixInstance;

	return Promise.resolve(matrix);
}