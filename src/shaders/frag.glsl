#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform vec2 uScale;

out vec4 outColor;

int get(int x, int y) {
    return int(texture(uSampler, (gl_FragCoord.xy + vec2(x, y)) / uScale).r);
}

void main() {
    int sum = get(-1, -1) + get(-1,  0) + get(-1,  1) +
              get( 0, -1)             + get( 0,  1) +
              get( 1, -1) + get( 1,  0) + get( 1,  1);

    int current = get(0, 0);
    if (sum == 3 || (sum == 2 && current == 1)) {
        outColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
