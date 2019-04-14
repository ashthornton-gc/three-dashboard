varying vec2 vUv;

uniform float u_time;

void main () {

    vUv = uv;

    vec3 transformed = vec3(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1 );

}