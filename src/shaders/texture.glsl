#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;
uniform sampler2D uSampler4;
uniform sampler2D uSampler5;
uniform sampler2D uSampler6;
uniform sampler2D uSampler7;

in vec2 vTextureCoord;

void main() {
    float sf = 20.0;
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 t = floor(uv * sf) / sf+(0.5/sf);
    vec2 direction = normalize(uMouse - t);

    float angle = atan(direction.y, direction.x);
    angle = degrees(angle);

    vec4 color;

    if (angle >= -22.5 && angle < 22.5) {
        color = texture(uSampler2, vTextureCoord*sf);
    } else if (angle >= 22.5 && angle < 67.5) {
        color = texture(uSampler4, vTextureCoord*sf);
    } else if (angle >= 67.5 && angle < 112.5) {
        color = texture(uSampler0, vTextureCoord*sf);
    } else if (angle >= 112.5 && angle < 157.5) {
        color = texture(uSampler6, vTextureCoord*sf);
    } else if ((angle >= 157.5 && angle <= 180.0) || (angle >= -180.0 && angle < -157.5)) {
        color = texture(uSampler3, vTextureCoord*sf);
    } else if (angle >= -157.5 && angle < -112.5) {
        color = texture(uSampler7, vTextureCoord*sf);
    } else if (angle >= -112.5 && angle < -67.5) {
        color = texture(uSampler1, vTextureCoord*sf);
    } else if (angle >= -67.5 && angle < -22.5) {
        color = texture(uSampler5, vTextureCoord*sf);
    }

    fragColor = color;
}
