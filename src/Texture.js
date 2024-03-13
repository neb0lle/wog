export default class Texture {
	constructor(gl, unit) {
		this.gl = gl;
		this.unit = unit;
		this.texture = null;
	}

	createTexture(imageUrl) {
		const image = new Image();
		image.onload = () => {
			this.texture = this.gl.createTexture();
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

			this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

			this.gl.texParameteri(
				this.gl.TEXTURE_2D,
				this.gl.TEXTURE_WRAP_S,
				this.gl.REPEAT,
			);
			this.gl.texParameteri(
				this.gl.TEXTURE_2D,
				this.gl.TEXTURE_WRAP_T,
				this.gl.CLAMP_TO_EDGE,
			);
			this.gl.texParameteri(
				this.gl.TEXTURE_2D,
				this.gl.TEXTURE_MIN_FILTER,
				this.gl.NEAREST,
			);
			this.gl.texParameteri(
				this.gl.TEXTURE_2D,
				this.gl.TEXTURE_MAG_FILTER,
				this.gl.NEAREST,
			);

			this.gl.texImage2D(
				this.gl.TEXTURE_2D,
				0,
				this.gl.RGBA,
				this.gl.RGBA,
				this.gl.UNSIGNED_BYTE,
				image,
			);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
		};
		image.src = imageUrl;
	}

	bind() {
		this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	}
}
