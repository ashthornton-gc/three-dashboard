varying vec2 vUv;

uniform float u_time;
uniform sampler2D u_texture;

void main() {
	
	vec2 uv = vUv;

    vec4 texture = texture2D(u_texture, uv);

    // if( texture.r < 0.1 && texture.g < 0.1 ) {
    //     texture.rgba = vec4(1.0);
    // }
	
	gl_FragColor = texture;

}