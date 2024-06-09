#version 300 es
precision highp float;

out vec4 fragColor;

in vec2 vCoord;

uniform float uTime;
uniform vec2 uResolution;

void main() {
    fragColor = vec4(vCoord.xy,.5,1.0);
}
