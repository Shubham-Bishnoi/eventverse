import { useEffect, useRef } from "react";

// Slowly folding silk (WebGL) with a tapered, glowing trail that follows the pointer (2D canvas).
// Only animates while on screen; reduced motion gets a single still frame and no trail.
const vertex = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;
const fragment = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  vec2 toPointer = u_pointer - uv;
  p += 0.06 * toPointer * exp(-dot(toPointer, toPointer) * 5.0);
  float t = u_time * 0.035;
  vec2 warp = vec2(fbm(p * 1.1 + t), fbm(p * 1.1 - t + 3.1));
  float field = fbm(p * 0.9 + 1.7 * warp + vec2(t * 0.6, -t * 0.4));
  float fold = sin((p.y * 1.6 + p.x * 0.35 + field * 3.0) * 3.14159);
  vec3 ink = vec3(0.045, 0.075, 0.06);
  vec3 deep = vec3(0.09, 0.2, 0.155);
  vec3 sheen = vec3(0.31, 0.38, 0.34);
  vec3 col = mix(ink, deep, smoothstep(-1.0, 0.5, fold));
  col = mix(col, sheen, smoothstep(0.6, 1.0, fold) * 0.5);
  col += vec3(0.16, 0.13, 0.08) * smoothstep(0.97, 1.0, fold) * 0.35;
  col *= mix(0.55, 1.0, smoothstep(1.15, 0.25, length(uv - 0.5)));
  gl_FragColor = vec4(col, 1.0);
}`;

const trailLife = 650; // ms a trail point lives before the tail retracts past it

export function SilkBackground() {
  const silkRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const silk = silkRef.current;
    const trailCanvas = trailRef.current;
    if (!silk || !trailCanvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = trailCanvas.getContext("2d");
    const gl = silk.getContext("webgl", { antialias: false, premultipliedAlpha: false });

    let uniforms:
      | {
          res: WebGLUniformLocation | null;
          time: WebGLUniformLocation | null;
          pointer: WebGLUniformLocation | null;
        }
      | undefined;
    if (gl) {
      const compile = (type: number, src: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        return shader;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const pos = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        uniforms = {
          res: gl.getUniformLocation(program, "u_res"),
          time: gl.getUniformLocation(program, "u_time"),
          pointer: gl.getUniformLocation(program, "u_pointer"),
        };
        silk.setAttribute("data-ready", "true");
      }
    }

    let width = 0,
      height = 0,
      dpr = 1;
    const resize = () => {
      const rect = silk.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // The silk is soft, so it renders at reduced resolution and scales up for free.
      silk.width = Math.max(1, Math.round(width * 0.5));
      silk.height = Math.max(1, Math.round(height * 0.5));
      trailCanvas.width = Math.round(width * dpr);
      trailCanvas.height = Math.round(height * dpr);
      if (gl) gl.viewport(0, 0, silk.width, silk.height);
    };

    const target = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };
    const head = { x: -1, y: -1 };
    let pointer: { x: number; y: number } | null = null;
    const points: { x: number; y: number; t: number }[] = [];
    const onMove = (e: PointerEvent) => {
      const rect = trailCanvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      target.x = pointer.x / Math.max(1, width);
      target.y = 1 - pointer.y / Math.max(1, height);
      if (head.x < 0) Object.assign(head, pointer);
    };

    const drawSilk = (now: number) => {
      if (!gl || !uniforms) return;
      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;
      gl.uniform2f(uniforms.res, silk.width, silk.height);
      gl.uniform1f(uniforms.time, now / 1000);
      gl.uniform2f(uniforms.pointer, eased.x, eased.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const drawTrail = (now: number) => {
      if (!ctx) return;
      if (pointer) {
        // The head springs toward the pointer, which is what makes the line feel silky.
        head.x += (pointer.x - head.x) * 0.32;
        head.y += (pointer.y - head.y) * 0.32;
        const last = points[points.length - 1];
        if (!last || Math.hypot(head.x - last.x, head.y - last.y) > 0.6)
          points.push({ x: head.x, y: head.y, t: now });
      }
      while (points.length && now - points[0]!.t > trailLife) points.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (points.length < 3) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(232, 207, 154, 0.75)";
      ctx.shadowBlur = 14;
      const n = points.length;
      for (let i = 1; i < n - 1; i++) {
        const a = points[i - 1]!,
          b = points[i]!,
          c = points[i + 1]!;
        const k = i / (n - 1);
        ctx.strokeStyle = `rgba(240, 220, 175, ${0.25 + 0.75 * k})`;
        ctx.lineWidth = 0.6 + 3.4 * k * k;
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.stroke();
      }
    };

    let raf = 0;
    let visible = false;
    const frame = (now: number) => {
      drawSilk(now);
      drawTrail(now);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible && !raf && !reduceMotion) raf = requestAnimationFrame(frame);
    });

    resize();
    if (reduceMotion) drawSilk(20000);
    else {
      observer.observe(silk);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="silk-background" aria-hidden>
      <canvas ref={silkRef} className="silk-canvas" />
      <canvas ref={trailRef} className="silk-trail" />
    </div>
  );
}
