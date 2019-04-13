#define PI 3.14159265359
varying vec2 vUv;

uniform float u_delta;
uniform float u_time;

void main () {

    // vec3 pos = position.xyz;

    vUv = uv;

    vec3 transformed = vec3(position);

    /* Ripple */
    // float dx = position.x;
    // float dy = position.y;
    // float freq = sqrt(dx*dx + dy*dy) * u_delta * 0.01;
    // float amp = 10.;
    // float angle = -u_time*0.1+freq;
    // transformed.x += cos(angle)*amp;

    /* Horizontal Wave */
    // float freq = u_delta * 0.008;
    // float amp = 10.;
    // float angle = (u_time * 0.2 + position.x)*freq;
    // transformed.y += cos(angle)*amp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1 );

    // vec2 waveDir = normalize(vec2( 1.0, 0.01 )); //Direction of wave in X Y plane

    // float wavefrontFactor = dot(position.xy, waveDir) * clamp( u_delta * 0.02, 0., 0.05 );
    // vec2 hor_perturb = 10.0*waveDir*(cos(wavefrontFactor));
    
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy + hor_perturb, 0.0, 1.0);

}