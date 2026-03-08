import type { LedMatrixInstance } from 'rpi-led-matrix';
import type { Painter } from 'rpi-led-matrix-painter';
import { TestMatrix } from './test-matrix';
import { getPainterMatrix as getPainterMatrixInternal } from './painter-matrix';



export const getPainterMatrix = async (): Promise<ReturnType<typeof getPainterMatrixInternal>> => {
	if (process.platform === 'linux') {
		return getPainterMatrixInternal();
	} else {
		return await getTestMatrix();
	}
}



const getTestMatrix = (): Promise<ReturnType<typeof getPainterMatrixInternal>>  => {
	const matrix = new TestMatrix(); //as ReturnType<typeof getPainterMatrixInternal>;

	return Promise.resolve(matrix);
}