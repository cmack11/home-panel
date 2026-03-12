export const getPainterMatrix = async (): Promise<{ matrix: any, controls: any}> => {
	const { RpiLedMatrix, ...rest } = require('@packages/painter');
    const { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } = RpiLedMatrix;
    const { Painter } = rest;

	const matrix = new Painter({
		...LedMatrix.defaultMatrixOptions(),
		rows: 32,
		cols: 64,
		chainLength: 2,
		hardwareMapping: GpioMapping.AdafruitHat,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.U,
		})

	}, {
		...LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 4,
		dropPrivileges: 0,
	});


	return {matrix, controls: rest};
};