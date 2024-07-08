#version 300 es

layout (location=0) in vec3 position;
layout (location=1) in vec2 coord;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

out vec2 vCoord;

void main() {
	gl_Position = vec4(position, 1.0);
	vCoord = coord;
}
