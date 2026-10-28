"use client";

type DadoProps = {
  valor: number | null;
  size?: number;
  color?: string;
  borderColor?: string;
};

const dot = (cx: number, cy: number, size: number) => (
  <circle key={`${cx}-${cy}`} cx={(cx * size) / 50} cy={(cy * size) / 50} r={size / 10} fill="#222" />
);

const dotsLayout: Record<number, [number, number][]> = {
  1: [[25, 25]],
  2: [[13, 13], [37, 37]],
  3: [[13, 13], [25, 25], [37, 37]],
  4: [
    [13, 13],
    [13, 37],
    [37, 13],
    [37, 37],
  ],
  5: [
    [13, 13],
    [13, 37],
    [25, 25],
    [37, 13],
    [37, 37],
  ],
  6: [
    [13, 13],
    [13, 25],
    [13, 37],
    [37, 13],
    [37, 25],
    [37, 37],
  ],
};

export function Dado({
  valor,
  size = 60,
  color = "#fff",
  borderColor = "#000000ff",
}: DadoProps) {
  return (
    <svg width={size} height={size} className="rounded-xl shadow-xl">
      <rect width={size} height={size} rx={size / 5} fill={color} stroke={borderColor} strokeWidth="3" />
      {(valor ? dotsLayout[valor] : [])?.map(([cx, cy]) => dot(cx, cy, size))}
    </svg>
  );
}
