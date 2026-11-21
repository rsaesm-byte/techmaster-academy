import { useEffect, useId, useRef, useState } from 'react';
import { usePrefereMenosMovimento } from '@/ui/usePrefereMenosMovimento';

const MAX_N = 20000;

/**
 * O LAÇO QUE DESENHA (WebGL)
 * Cada repetição do "para" desenha um ponto. A GPU desenha milhares de pontos por quadro,
 * então o aluno vê o efeito de repetir 10, 100 ou 20 000 vezes — e de mudar um único número.
 * Sem WebGL, cai para Canvas 2D. Com "menos movimento", desenha tudo de uma vez.
 */

const VERT = `
attribute float a_i;
uniform float u_ang;
uniform float u_raio;
uniform float u_escala;
uniform float u_n;
uniform float u_tamanho;
varying float v_t;
void main() {
  float i = a_i + 1.0;
  float r = i * u_raio * u_escala;
  gl_Position = vec4(cos(i * u_ang) * r, sin(i * u_ang) * r, 0.0, 1.0);
  gl_PointSize = u_tamanho;
  v_t = a_i / max(u_n - 1.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying float v_t;
uniform vec3 u_cor1;
uniform vec3 u_cor2;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(mix(u_cor1, u_cor2, v_t), 1.0);
}`;

interface Params {
  n: number;
  angulo: number;
  raio: number;
}

function hexParaRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return [0.38, 0.65, 0.98];
  return [1, 2, 3].map((i) => parseInt(m[i] as string, 16) / 255) as [number, number, number];
}

function criarDesenhista(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false });
  if (!gl) return null;
  const compilar = (tipo: number, fonte: string) => {
    const s = gl.createShader(tipo);
    if (!s) throw new Error('shader');
    gl.shaderSource(s, fonte);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const indices = new Float32Array(MAX_N).map((_, i) => i);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_i');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 0, 0);
  const u = (nome: string) => gl.getUniformLocation(prog, nome);

  return (p: Params, quantos: number, cores: { fundo: string; c1: string; c2: string }) => {
    const dpr = window.devicePixelRatio || 1;
    gl.viewport(0, 0, canvas.width, canvas.height);
    const [r, g, b] = hexParaRgb(cores.fundo);
    gl.clearColor(r, g, b, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u('u_ang'), (p.angulo * Math.PI) / 180);
    gl.uniform1f(u('u_raio'), p.raio);
    gl.uniform1f(u('u_escala'), 0.94 / (p.n * p.raio));
    gl.uniform1f(u('u_n'), p.n);
    gl.uniform1f(u('u_tamanho'), Math.max(2, Math.min(9, 900 / Math.sqrt(p.n))) * dpr * 0.5);
    gl.uniform3fv(u('u_cor1'), hexParaRgb(cores.c1));
    gl.uniform3fv(u('u_cor2'), hexParaRgb(cores.c2));
    gl.drawArrays(gl.POINTS, 0, quantos);
  };
}

function desenhar2D(
  canvas: HTMLCanvasElement,
  p: Params,
  quantos: number,
  cores: { fundo: string; c1: string; c2: string },
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  ctx.fillStyle = cores.fundo;
  ctx.fillRect(0, 0, w, h);
  const escala = (0.94 * Math.min(w, h)) / 2 / (p.n * p.raio);
  for (let k = 0; k < quantos; k++) {
    const i = k + 1;
    const a = (i * p.angulo * Math.PI) / 180;
    const r = i * p.raio * escala;
    ctx.fillStyle = k / p.n < 0.5 ? cores.c1 : cores.c2;
    ctx.fillRect(w / 2 + Math.cos(a) * r - 1, h / 2 - Math.sin(a) * r - 1, 2, 2);
  }
}

function lerCores() {
  const css = getComputedStyle(document.documentElement);
  return {
    fundo: css.getPropertyValue('--tm-surface-2').trim() || '#f1f5f9',
    c1: css.getPropertyValue('--tm-primary').trim() || '#1d4ed8',
    c2: css.getPropertyValue('--tm-accent').trim() || '#8a6a12',
  };
}

export function LacoGrafico() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desenhista = useRef<ReturnType<typeof criarDesenhista> | undefined>(undefined);
  const [params, setParams] = useState<Params>({ n: 600, angulo: 137.5, raio: 1 });
  const [desenhados, setDesenhados] = useState(0);
  const [semWebgl, setSemWebgl] = useState(false);
  const menosMovimento = usePrefereMenosMovimento();
  const ids = useId();

  // Cria o contexto WebGL uma vez.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = c.clientWidth * dpr;
    c.height = c.clientWidth * dpr;
    try {
      desenhista.current = criarDesenhista(c);
    } catch {
      desenhista.current = null;
    }
    if (!desenhista.current) setSemWebgl(true);
  }, []);

  // Anima o laço "executando": os pontos aparecem na ordem das repetições.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const cores = lerCores();
    const pintar = (k: number) => {
      if (desenhista.current) desenhista.current(params, k, cores);
      else desenhar2D(c, params, k, cores);
      setDesenhados(k);
    };
    if (menosMovimento) {
      const q = requestAnimationFrame(() => pintar(params.n));
      return () => cancelAnimationFrame(q);
    }
    const duracao = 1600;
    let inicio: number | undefined;
    let quadro = 0;
    const animar = (t: number) => {
      inicio ??= t;
      const k = Math.min(params.n, Math.ceil(((t - inicio) / duracao) * params.n));
      pintar(k);
      if (k < params.n) quadro = requestAnimationFrame(animar);
    };
    quadro = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(quadro);
  }, [params, menosMovimento]);

  const primeiras = [1, 2, 3].map((i) => ({
    i,
    angulo: (i * params.angulo) % 360,
    raio: i * params.raio,
  }));
  const campo = (rotulo: string, chave: keyof Params, min: number, max: number, passo: number) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between">
        <span className="font-medium">{rotulo}</span>
        <span className="font-mono">{params[chave]}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={params[chave]}
        onChange={(e) => setParams((p) => ({ ...p, [chave]: Number(e.target.value) }))}
        className="accent-[var(--tm-primary)]"
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Desenho feito por um laço de ${params.n} repetições: cada repetição põe um ponto girando ${params.angulo} graus e se afastando ${params.raio} do centro, formando uma espiral.`}
            className="aspect-square w-full rounded-xl"
          />
          <p aria-live="off" className="m-0 text-center font-mono text-sm">
            repetições executadas: <strong>{desenhados}</strong> de {params.n}
          </p>
          {semWebgl && (
            <p className="m-0 text-center text-xs text-muted">
              Seu navegador não tem WebGL: usando desenho simples.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <pre className="m-0 overflow-x-auto rounded-xl bg-surface-2 p-3 font-mono text-[13px] leading-6 [font-variant-ligatures:none]">
            {`para i de 1 ate ${params.n} faca\n  angulo <- i * ${params.angulo}\n  raio <- i * ${params.raio}\n  desenhe_ponto(angulo, raio)\nfimpara`}
          </pre>
          {campo('Quantas repetições (N)', 'n', 1, MAX_N, 1)}
          {campo('Giro por repetição (graus)', 'angulo', 1, 360, 0.5)}
          {campo('Afastamento por repetição', 'raio', 0.5, 5, 0.5)}
          <div className="flex flex-wrap gap-2">
            {[
              { rotulo: 'Girassol (137,5°)', p: { angulo: 137.5, n: 2000 } },
              { rotulo: '90° em 4 braços', p: { angulo: 90, n: 400 } },
              { rotulo: 'Quase 120°', p: { angulo: 121, n: 3000 } },
              { rotulo: '10 repetições', p: { n: 10 } },
            ].map((x) => (
              <button
                key={x.rotulo}
                type="button"
                onClick={() => setParams((p) => ({ ...p, ...x.p }))}
                className="min-h-10 rounded-full border border-border px-3 text-sm hover:bg-surface-2"
              >
                {x.rotulo}
              </button>
            ))}
          </div>
        </div>
      </div>
      <details className="text-[15px]">
        <summary className="cursor-pointer font-medium">
          As 3 primeiras repetições, em tabela
        </summary>
        <table
          className="mt-2 w-full max-w-md border-collapse font-mono text-sm"
          aria-describedby={`${ids}-nota`}
        >
          <thead>
            <tr className="text-left text-muted">
              <th className="border-b border-border py-1">i</th>
              <th className="border-b border-border py-1">angulo (°)</th>
              <th className="border-b border-border py-1">raio</th>
            </tr>
          </thead>
          <tbody>
            {primeiras.map((l) => (
              <tr key={l.i}>
                <td className="py-1">{l.i}</td>
                <td>{Math.round(l.angulo * 10) / 10}</td>
                <td>{l.raio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p id={`${ids}-nota`} className="mt-2 mb-0 text-muted">
          O mesmo bloco roda para cada valor de i; só o i muda. Ângulos acima de 360° dão a volta
          (mostramos o resto da divisão por 360).
        </p>
      </details>
    </div>
  );
}
