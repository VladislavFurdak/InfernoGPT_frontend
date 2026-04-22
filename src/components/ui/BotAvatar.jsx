/**
 * BotAvatar — Reusable bot avatar using the custom logo image.
 *
 * Uses optimized image sizes (32/64/128px) based on the `size` prop
 * to avoid loading the full 1024px original. Renders as a rounded
 * image with a brand glow shadow.
 */
const sizeConfig = {
  sm: { classes: 'w-8 h-8', src: '/gpt_icon_128.png', px: 32 },
  md: { classes: 'w-10 h-10', src: '/gpt_icon_128.png', px: 40 },
  lg: { classes: 'w-16 h-16', src: '/gpt_icon_128.png', px: 64 },
};

export default function BotAvatar({ size = 'sm', className = '' }) {
  const { classes, src, px } = sizeConfig[size];

  return (
    <img
      src={src}
      alt="InfernoGPT"
      width={px}
      height={px}
      className={`rounded-lg flex-shrink-0 object-contain p-0.5 ${classes} ${className}`}
    />
  );
}
