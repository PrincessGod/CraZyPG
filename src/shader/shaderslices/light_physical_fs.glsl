PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.specularRoughness = clamp( roughnessFactor, 0.04, 1.0 );
material.specularColor = mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( u_reflectivity ) ), diffuseColor.rgb, metalnessFactor );
material.clearCoat = saturate( u_clearCoat ); // Burley clearcoat model
material.clearCoatRoughness = clamp( u_clearCoatRoughness, 0.04, 1.0 );
