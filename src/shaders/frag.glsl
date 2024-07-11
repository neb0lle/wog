#version 300 es
precision highp float;

out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uPos;

uniform sampler2D uSampler;

in vec2 vCoord;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float radius = 0.01;
    float dist = distance(uv, uMouse);
    if (dist < radius) {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
		fragColor = vec4(texture(uSampler,vCoord).rgb-vec3(uMouse/10.0,1.0),1.0);
    }
}
