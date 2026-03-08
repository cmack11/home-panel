import type { LedMatrixInstance } from 'rpi-led-matrix';
import type { Painter } from 'rpi-led-matrix-painter';
import { TestMatrix } from './test-matrix';
import { getRealMatrix } from './matrix';
import { getPainterMatrix as getPainterMatrixInternal } from './painter-matrix';
import { get } from 'node:http';

export const getBasicMatrix = (): Promise<LedMatrixInstance> => {
	if (process.platform === 'linux') {
		return getRealMatrix();
	} else {
		return getTestMatrix();
	}
}

export const getPainterMatrix = async (): Promise<ReturnType<typeof getPainterMatrixInternal>> => {
	if (process.platform === 'linux') {
		return getPainterMatrixInternal();
	} else {
		const matrix = await getTestMatrix();
		return { matrix, controls: {} };
	}
}



const getTestMatrix = (): Promise<LedMatrixInstance> => {
	const matrix = new TestMatrix() as LedMatrixInstance;

	return Promise.resolve(matrix);
}