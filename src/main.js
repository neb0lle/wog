import Shader from "./Shader";
import Texture from "./Texture";
import { TexMap } from "./Model";
import { mouseX, mouseY } from "./Input";

import vertexShaderSource from "./shaders/vert.glsl";
import fragmentShaderSource from "./shaders/texture.glsl";

import n from "./textures2/n.jpg";
import s from "./textures2/s.jpg";
import e from "./textures2/e.jpg";
import w from "./textures2/w.jpg";
import ne from "./textures2/ne.jpg";
import se from "./textures2/se.jpg";
import nw from "./textures2/nw.jpg";
import sw from "./textures2/sw.jpg";

const canvas = document.querySelector("#glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const resolution = [canvas.width, canvas.height];

const gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl2"));

if (gl === null) {
	alert("Unable to initialize WebGL.");
} else {
	// SHADER
	const vert = Shader.compileShader(vertexShaderSource, gl.VERTEX_SHADER, gl);
	const frag0 = Shader.compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER, gl);

	const globalShader = new Shader(gl);
	globalShader.createShaders(vert, frag0);

	// DATA
	const data = new TexMap(gl);
	data.setup();

	// TEXTURE
	const textures = [
		new Texture(gl, 0),
		new Texture(gl, 1),
		new Texture(gl, 2),
		new Texture(gl, 3),
		new Texture(gl, 4),
		new Texture(gl, 5),
		new Texture(gl, 6),
		new Texture(gl, 7),
	];

	const images = [n, s, e, w, ne, se, nw, sw];

	images.forEach((image, index) => {
		textures[index].createTex(image, 3010, 2007);
	});

	gl.useProgram(globalShader.program);

	// UNIFORMS
	for (let i = 0; i < 8; i++) {
		const samplerLocation = gl.getUniformLocation(globalShader.program, `uSampler${i}`);
		gl.uniform1i(samplerLocation, i);
	}

	const startTime = performance.now();
	let currentTime, elapsedTime;
	const uTimeLocation = gl.getUniformLocation(globalShader.program, "uTime");
	const uResolutionLocation = gl.getUniformLocation(globalShader.program, "uResolution");
	const uMouseLocation = gl.getUniformLocation(globalShader.program, "uMouse");

	gl.uniform2fv(uResolutionLocation, resolution);

	gl.clearColor(1, 1, 1, 1);

	function renderLoop() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		// UPDATE
		currentTime = performance.now();
		elapsedTime = (currentTime - startTime) / 1000;
		gl.uniform1f(uTimeLocation, elapsedTime);
		gl.uniform2f(uMouseLocation, mouseX / resolution[0], 1.0 - mouseY / resolution[1]);
		data.render();

		requestAnimationFrame(renderLoop);
	}

	renderLoop();
}
