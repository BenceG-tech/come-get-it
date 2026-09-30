import React, { forwardRef } from 'react';

interface DevicePhoneProps {
  /** App screens (920 × 2000); only `active` is shown, the rest cross-fade out. */
  screens: string[];
  active: number;
  alts?: string[];
  className?: string;
  style?: React.CSSProperties;
  /** Extra layers inside the screen, above the images (UI loops, pins). */
  children?: React.ReactNode;
  eager?: boolean;
}

/**
 * The one device used across the homepage stories: titanium frame with real thickness,
 * side buttons, Dynamic Island and a glass glare that follows the tilt (--rx/--ry are set by the parent).
 */
export const DevicePhone = forwardRef<HTMLDivElement, DevicePhoneProps>(({ screens, active, alts = [], className = '', style, children, eager }, ref) => (
  <div ref={ref} className={`device ${className}`} style={style}>
    <div className="device-edge" aria-hidden="true" />
    <div className="device-body">
      <span className="device-btn device-btn-action" aria-hidden="true" />
      <span className="device-btn device-btn-vol-up" aria-hidden="true" />
      <span className="device-btn device-btn-vol-down" aria-hidden="true" />
      <span className="device-btn device-btn-power" aria-hidden="true" />
      <div className="device-screen">
        {screens.map((src, i) => (
          <img
            key={src}
            src={src}
            className={i === active ? 'is-active' : undefined}
            alt={i === active ? alts[i] ?? '' : ''}
            aria-hidden={i !== active}
            width={920}
            height={2000}
            loading={eager || i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        {children}
        <div className="device-island" aria-hidden="true" />
        <div className="device-glare" aria-hidden="true" />
      </div>
    </div>
  </div>
));
DevicePhone.displayName = 'DevicePhone';
