varying vec2 vUv;

uniform float u_time;
uniform sampler2D u_texture;
uniform float u_delta;

void main() {
	
	vec2 uv = vUv;

	// const float PI = 3.141592;

    // uv.x += (
    //   sin(uv.x * 10.0 + ((u_time * 2.0 *(PI / 3.0)) * 0.031))
    //   + sin(uv.y * 10.0 + ((u_time * 2.0 * (PI / 2.489)) * 0.017))
    //   ) * 0.0075;

    // uv.y += (
    //   sin(uv.y * 20.0 + ((u_time * 2.0 * (PI / 2.023)) * 0.023))
    //   + sin(uv.x * 20.0 + ((u_time * 2.0 * (PI / 3.1254)) * 0.037))
    //   ) * 0.015;

	vec4 texture = texture2D( u_texture, uv );

	float gray = dot(texture.rgb, vec3(0.299, 0.587, 0.114));
	
	gl_FragColor = mix( texture, vec4(vec3(gray), 1.0), clamp(u_delta, 0.0, 1.0) );

}