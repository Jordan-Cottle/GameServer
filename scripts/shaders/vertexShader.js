let vertexShaderSource = `
attribute vec4 vPosition;
attribute vec4 vColor;

uniform mat4 cameraTransform;

varying vec4 fColor;

void main()
{
	fColor = vColor;
	gl_Position = cameraTransform*vPosition;
}
`;