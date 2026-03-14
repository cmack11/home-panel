import { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType, RuntimeFlag } from "rpi-led-matrix"

export const getMatrix = () => {
    return new LedMatrix({
		...LedMatrix.defaultMatrixOptions(),
		rows: 32,
		cols: 64,
		chainLength: 2,
		hardwareMapping: GpioMapping.AdafruitHat,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.U,
		}),
        showRefreshRate: true,
        pwmLsbNanoseconds: 200,
        pwmDitherBits: 2,
        limitRefreshRateHz: 100
	}, {
		...LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 4,
		dropPrivileges: RuntimeFlag.On,
	})
}