export const getRealMatrix = async () => {
	const { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } = require('rpi-led-matrix-painter');

	const matrix = new LedMatrix({
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


	return matrix;
};