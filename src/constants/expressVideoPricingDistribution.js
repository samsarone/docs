export const EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND = Object.freeze({
  pipeline: 4,
  inference: 4,
  image_gen_edit: 2,
  speech: 2,
  music: 2,
  effects_and_lipsync: 2,
});

export const EXPRESS_VIDEO_FIXED_COMPONENTS_TOTAL_PER_SECOND =
  Object.values(EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND)
    .reduce((total, value) => total + value, 0);

export const EXPRESS_VIDEO_OPTIONAL_ADDON_CREDITS_PER_SECOND = Object.freeze({
  express_cta_generation: 1,
});

export const EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL = Object.freeze({
  'VEO3.1I2V': 60,
  'VEO3.1I2VFAST': 36,
  COSMOS3SUPERI2V: 20,
  SEEDANCEI2V: 30,
  KLINGIMGTOVID3PRO: 36,
  HAPPYHORSEI2V: 36,
  RUNWAYML: 30,
});

export const EXPRESS_VIDEO_PRICING_DISTRIBUTION_PER_SECOND_BY_MODEL = Object.freeze(
  Object.fromEntries(
    Object.entries(EXPRESS_VIDEO_CREDITS_PER_SECOND_BY_MODEL)
      .map(([model, total]) => [
        model,
        Object.freeze({
          ...EXPRESS_VIDEO_FIXED_PRICING_COMPONENTS_PER_SECOND,
          video: total - EXPRESS_VIDEO_FIXED_COMPONENTS_TOTAL_PER_SECOND,
          total,
          optionalAddons: EXPRESS_VIDEO_OPTIONAL_ADDON_CREDITS_PER_SECOND,
        }),
      ]),
  ),
);

export const EXPRESS_VIDEO_OPTIONAL_STAGE_CREDITS_PER_SECOND = Object.freeze({
  narrator_avatar_generation: 4,
  express_cta_generation: 1,
});
