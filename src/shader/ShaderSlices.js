/* eslint camelcase: 0 */
import pack from './shaderslices/pack.glsl';
import common from './shaderslices/common.glsl';
import bsdf from './shaderslices/bsdf.glsl';

import light_spec from './shaderslices/light_spec.glsl';
import begin_light_fs from './shaderslices/begin_light_fs.glsl';
import light_textures_fs from './shaderslices/light_textures_fs.glsl';
import end_light_fs from './shaderslices/end_light_fs.glsl';
import light_lambert_fs from './shaderslices/light_lambert_fs.glsl';
import light_phong_spec_fs from './shaderslices/light_phong_spec_fs.glsl';
import light_phong_fs from './shaderslices/light_phong_fs.glsl';

import common_vs from './shaderslices/common_vs.glsl';
import uv_spec_vs from './shaderslices/uv_spec_vs.glsl';
import uv2_spec_vs from './shaderslices/uv2_spec_vs.glsl';
import normal_spec_vs from './shaderslices/normal_spec_vs.glsl';
import color_spec_vs from './shaderslices/color_spec_vs.glsl';
import worldpos_spec_vs from './shaderslices/worldpos_spec_vs.glsl';
import fog_spec_vs from './shaderslices/fog_spec_vs.glsl';
import logdepth_spec_vs from './shaderslices/logdepth_spec_vs.glsl';

import begin_position_vs from './shaderslices/begin_position_vs.glsl';
import begin_normal_vs from './shaderslices/begin_normal_vs.glsl';
import begin_normal_fs from './shaderslices/begin_normal_fs.glsl';

import morph_vs from './shaderslices/morph_vs.glsl';
import skinning_vs from './shaderslices/skinning_vs.glsl';
import uv_vs from './shaderslices/uv_vs.glsl';
import uv2_vs from './shaderslices/uv2_vs.glsl';
import normal_vs from './shaderslices/normal_vs.glsl';
import color_vs from './shaderslices/color_vs.glsl';
import position_vs from './shaderslices/position_vs.glsl';
import worldpos_vs from './shaderslices/worldpos_vs.glsl';
import fog_vs from './shaderslices/fog_vs.glsl';
import logdepth_vs from './shaderslices/logdepth_vs.glsl';

import common_fs from './shaderslices/common_fs.glsl';
import uv_spec_fs from './shaderslices/uv_spec_fs.glsl';
import uv2_spec_fs from './shaderslices/uv2_spec_fs.glsl';
import normal_spec_fs from './shaderslices/normal_spec_fs.glsl';
import color_spec_fs from './shaderslices/color_spec_fs.glsl';
import worldpos_spec_fs from './shaderslices/worldpos_spec_fs.glsl';
import base_texture_spec_fs from './shaderslices/base_texture_spec_fs.glsl';
import alpha_texture_spec_fs from './shaderslices/alpha_texture_spec_fs.glsl';
import specular_texture_spec_fs from './shaderslices/specular_texture_spec_fs.glsl';
import light_texture_spec_fs from './shaderslices/light_texture_spec_fs.glsl';
import ao_texture_spec_fs from './shaderslices/ao_texture_spec_fs.glsl';
import env_texture_spec_fs from './shaderslices/env_texture_spec_fs.glsl';
import normal_texture_spec_fs from './shaderslices/normal_texture_spec_fs.glsl';
import bump_texture_spec_fs from './shaderslices/bump_texture_spec_fs.glsl';
import emissive_texture_spec_fs from './shaderslices/emissive_texture_spec_fs.glsl';
import fog_spec_fs from './shaderslices/fog_spec_fs.glsl';
import dither_spec_fs from './shaderslices/dither_spec_fs.glsl';
import logdepth_spec_fs from './shaderslices/logdepth_spec_fs.glsl';
import gradient_texture_spec_fs from './shaderslices/gradient_texture_spec_fs.glsl';

import base_texture_fs from './shaderslices/base_texture_fs.glsl';
import color_fs from './shaderslices/color_fs.glsl';
import alpha_texture_fs from './shaderslices/alpha_texture_fs.glsl';
import alpha_mask_fs from './shaderslices/alpha_mask_fs.glsl';
import alpha_blend_fs from './shaderslices/alpha_blend_fs.glsl';
import specular_texture_fs from './shaderslices/specular_texture_fs.glsl';
import light_texture_fs from './shaderslices/light_texture_fs.glsl';
import ao_texture_fs from './shaderslices/ao_texture_fs.glsl';
import env_texture_fs from './shaderslices/env_texture_fs.glsl';
import normal_texture_fs from './shaderslices/normal_texture_fs.glsl';
import emissive_texture_fs from './shaderslices/emissive_texture_fs.glsl';
import fog_fs from './shaderslices/fog_fs.glsl';
import dither_fs from './shaderslices/dither_fs.glsl';
import logdepth_fs from './shaderslices/logdepth_fs.glsl';

export const ShaderSlices = {

    pack,
    common,

    bsdf,
    light_spec,
    begin_light_fs,
    light_textures_fs,
    end_light_fs,
    light_lambert_fs,
    light_phong_spec_fs,
    light_phong_fs,

    common_vs,
    uv_spec_vs,
    uv2_spec_vs,
    normal_spec_vs,
    color_spec_vs,
    worldpos_spec_vs,
    fog_spec_vs,
    logdepth_spec_vs,

    begin_position_vs,
    begin_normal_vs,
    begin_normal_fs,

    morph_vs,
    skinning_vs,
    uv_vs,
    uv2_vs,
    normal_vs,
    color_vs,
    worldpos_vs,
    position_vs,
    fog_vs,
    logdepth_vs,

    common_fs,
    uv_spec_fs,
    uv2_spec_fs,
    normal_spec_fs,
    color_spec_fs,
    worldpos_spec_fs,
    base_texture_spec_fs,
    alpha_texture_spec_fs,
    specular_texture_spec_fs,
    light_texture_spec_fs,
    ao_texture_spec_fs,
    env_texture_spec_fs,
    normal_texture_spec_fs,
    bump_texture_spec_fs,
    emissive_texture_spec_fs,
    fog_spec_fs,
    dither_spec_fs,
    logdepth_spec_fs,
    gradient_texture_spec_fs,

    base_texture_fs,
    color_fs,
    alpha_texture_fs,
    alpha_mask_fs,
    alpha_blend_fs,
    specular_texture_fs,
    light_texture_fs,
    ao_texture_fs,
    env_texture_fs,
    normal_texture_fs,
    emissive_texture_fs,
    fog_fs,
    dither_fs,
    logdepth_fs,

};
