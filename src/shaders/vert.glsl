#version 300 es

layout (location=0) in vec4 position;
// layout (location=1) in vec2 texCoord;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

// out vec2 vTextureCoord;

void main() {
	gl_Position = position;
	// vTextureCoord = texCoord;
	// gl_Position = vec4(position.x*cos(uTime*position.x),position.y*cos(uTime*position.y),position.z, 1.0);
	// gl_Position = vec4(position.xy+uMouse, position.z, 1.0);
	// gl_Position = vec4(position.xy+uPos, position.z, 1.0);

	// vColor = color;
	// vColor = vec3(sin(uTime*position.x),0.0,cos(uTime*position.y));
	// vColor = vec3(abs(.5-position.xyz));
	// vColor = vec3(abs(.5-position.x)*sin(uTime),0.0,abs(.5-position.z)*cos(uTime));
}
