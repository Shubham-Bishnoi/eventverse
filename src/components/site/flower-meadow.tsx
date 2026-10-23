import { useEffect, useRef } from "react";

// A field of wedding flowers drawn in code: stems sway in a light wind and bend away
// from the pointer, then spring back. Animates only on screen; reduced motion gets a still field.
type Kind = "marigold" | "rose" | "jasmine" | "lotus";
type Flower = {
  x: number;
  height: number;
  z: number;
  angle: number;
  velocity: number;
  lean: number;
  phase: number;
  sprite: HTMLCanvasElement;
  leafSide: number;
};

const kinds: Kind[] = ["marigold", "rose", "jasmine", "lotus", "marigold", "rose"];
const headRadius = 27;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function petalPath(ctx: CanvasRenderingContext2D, length: number, width: number) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width, -length * 0.3, width * 0.8, -length * 0.9, 0, -length);
  ctx.bezierCurveTo(-width * 0.8, -length * 0.9, -width, -length * 0.3, 0, 0);
}

function drawHead(ctx: CanvasRenderingContext2D, kind: Kind, r: number, rand: () => number) {
  const fill = (inner: string, outer: string, reach: number) => {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, reach);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    return g;
  };
  if (kind === "marigold") {
    for (const [ring, count, inner, outer] of [
      [1, 18, "#c4581c", "#f0a43c"],
      [0.74, 15, "#cf6a20", "#f6b94e"],
      [0.48, 11, "#d97a26", "#fbd27a"],
    ] as const) {
      for (let i = 0; i < count; i++) {
        ctx.save();
        ctx.rotate((i / count) * Math.PI * 2 + ring * 2 + rand() * 0.2);
        ctx.fillStyle = fill(inner, outer, r * ring);
        petalPath(ctx, r * ring, r * ring * 0.32);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.fillStyle = "#8a3a12";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "rose") {
    for (const [ring, count, inner, outer] of [
      [1, 5, "#8e3b4a", "#e3a2a1"],
      [0.72, 5, "#86323f", "#d98d90"],
      [0.46, 4, "#7a2a37", "#c9727a"],
    ] as const) {
      for (let i = 0; i < count; i++) {
        ctx.save();
        ctx.rotate((i / count) * Math.PI * 2 + ring * 1.3);
        ctx.fillStyle = fill(inner, outer, r * ring);
        ctx.beginPath();
        ctx.ellipse(0, -r * ring * 0.45, r * ring * 0.5, r * ring * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.strokeStyle = "rgba(90, 24, 36, .55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 5; a += 0.2)
      ctx.lineTo(Math.cos(a) * a * 0.9, Math.sin(a) * a * 0.9);
    ctx.stroke();
  } else if (kind === "jasmine") {
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i / 6) * Math.PI * 2 + rand() * 0.15);
      ctx.fillStyle = fill("#d8c7a6", "#f7f1e4", r);
      petalPath(ctx, r * 0.95, r * 0.3);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#c79a3e";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7a5a1e";
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Lotus seen from the side: a cup of pointed petals fanning upward.
    for (const [spread, scale, inner, outer] of [
      [1.05, 0.9, "#b86a7a", "#e9b6bb"],
      [0.6, 1, "#c27482", "#f1c6c9"],
      [0, 1.05, "#cf8592", "#f8dadb"],
    ] as const) {
      for (const side of spread === 0 ? [0] : [-1, 1]) {
        ctx.save();
        ctx.translate(0, r * 0.45);
        ctx.rotate(side * spread * 0.75);
        ctx.fillStyle = fill(inner, outer, r * 1.1);
        petalPath(ctx, r * 1.05 * scale, r * 0.38);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

function makeSprite(kind: Kind, r: number, dpr: number, rand: () => number) {
  const size = Math.ceil(r * 2.6);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.ceil(size * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.translate(size / 2, size / 2);
    drawHead(ctx, kind, r, rand);
  }
  return canvas;
}

export function FlowerMeadow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0,
      height = 0,
      dpr = 1;
    let flowers: Flower[] = [];
    const pointer = { x: -9999, y: -9999, vx: 0 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const rand = seeded(7);
      const sprites = new Map<string, HTMLCanvasElement>();
      const count = Math.min(70, Math.round(width / 24));
      flowers = Array.from({ length: count }, (_, i) => {
        const z = rand();
        const kind = kinds[Math.floor(rand() * kinds.length)]!;
        const variant = Math.floor(rand() * 3);
        const key = `${kind}-${variant}`;
        if (!sprites.has(key))
          sprites.set(key, makeSprite(kind, headRadius * (0.85 + variant * 0.15), dpr, rand));
        return {
          x: ((i + 0.2 + rand() * 0.6) / count) * width,
          height: height * (0.42 + rand() * 0.45) * (0.75 + z * 0.25),
          z,
          angle: 0,
          velocity: 0,
          lean: (rand() - 0.5) * 0.18,
          phase: rand() * Math.PI * 2,
          sprite: sprites.get(key)!,
          leafSide: rand() > 0.5 ? 1 : -1,
        };
      }).sort((a, b) => a.z - b.z);
      flowers.forEach((f) => (f.angle = f.lean));
    };

    const draw = (now: number, animate: boolean) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const radius = 130;
      for (const f of flowers) {
        const scale = 0.62 + f.z * 0.38;
        const headX = f.x + Math.sin(f.angle) * f.height;
        const headY = height - Math.cos(f.angle) * f.height;
        if (animate) {
          const wind =
            Math.sin(now * 0.0008 + f.phase) * 0.045 + Math.sin(now * 0.0021 + f.phase * 2) * 0.015;
          const dx = headX - pointer.x;
          const distance = Math.hypot(dx, headY - pointer.y);
          let push = 0;
          if (distance < radius) {
            const near = 1 - distance / radius;
            push = near * near * (Math.sign(dx) * 0.016 + pointer.vx * 0.0009);
          }
          f.velocity += (f.lean + wind - f.angle) * 0.018 + push;
          f.velocity *= 0.9;
          f.angle = Math.max(-0.75, Math.min(0.75, f.angle + f.velocity));
        }
        ctx.globalAlpha = 0.45 + f.z * 0.55;
        // Stem: rooted at the bottom, bending most near the head.
        const cx = f.x + Math.sin(f.angle) * f.height * 0.25;
        const cy = height - f.height * 0.6;
        ctx.strokeStyle = "#5f6f55";
        ctx.lineWidth = 1.6 * scale;
        ctx.beginPath();
        ctx.moveTo(f.x, height);
        ctx.quadraticCurveTo(cx, cy, headX, headY);
        ctx.stroke();
        ctx.fillStyle = "#6b7d5f";
        for (const [t, side] of [
          [0.38, f.leafSide],
          [0.62, -f.leafSide],
        ] as const) {
          const u = 1 - t;
          const lx = u * u * f.x + 2 * u * t * cx + t * t * headX;
          const ly = u * u * height + 2 * u * t * cy + t * t * headY;
          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(f.angle * t + side * 0.9);
          ctx.beginPath();
          ctx.ellipse(side * 9 * scale, 0, 10 * scale, 3.4 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        const size = (f.sprite.width / dpr) * scale;
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(f.angle * 0.8);
        ctx.drawImage(f.sprite, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      pointer.vx *= 0.85;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (pointer.x > -9999) pointer.vx = x - pointer.x;
      pointer.x = x;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    let raf = 0;
    let visible = false;
    const frame = (now: number) => {
      draw(now, true);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    const onResize = () => {
      build();
      draw(performance.now(), false);
    };

    onResize();
    if (!reduceMotion) {
      observer.observe(canvas);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="flower-meadow" aria-hidden />;
}
