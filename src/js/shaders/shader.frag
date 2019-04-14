varying vec2 vUv;

uniform float u_time;
uniform sampler2D u_texture;

void main() {
	
	vec2 uv = vUv;

    vec4 texture = texture2D(u_texture, uv);

    // if( texture.a < 0.01 ) {
    //     texture.rgba = vec4(0.5);
    // }
	
	gl_FragColor = texture;

}