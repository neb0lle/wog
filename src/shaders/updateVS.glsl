#version 300 es
in vec2 oldPosition;
in vec2 velocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 newPosition;

void main() {
	newPosition = oldPosition + velocity * deltaTime;
}
