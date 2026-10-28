import { Ficha } from "./Ficha";

type TableroProps = {
  fichas: { x: number; y: number; color: string }[];
  onFichaClick: (index: number) => void;
};

// Componente auxiliar para dibujar mallas
const DibujarMalla = ({ x, y, ancho, alto, filas, columnas }: { x: number; y: number; ancho: number; alto: number; filas: number; columnas: number }) => {
  const lineas = [];

  for (let i = 0; i <= filas; i++) {
    const yPos = y + (alto / filas) * i;
    lineas.push(<line key={`h${i}`} x1={x} y1={yPos} x2={x + ancho} y2={yPos} stroke="black" strokeWidth="1" />);
  }

  for (let i = 0; i <= columnas; i++) {
    const xPos = x + (ancho / columnas) * i;
    lineas.push(<line key={`v${i}`} x1={xPos} y1={y} x2={xPos} y2={y + alto} stroke="black" strokeWidth="1" />);
  }

  return <g>{lineas}</g>;
};

const CasillaEspecial = ({
  x,
  y,
  ancho,
  alto,
  filas,
  columnas,
  fila,
  columna,
  color,
}: {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  filas: number;
  columnas: number;
  fila: number;    // índice 0 = primera fila desde arriba
  columna: number; // índice 0 = primera columna desde la izquierda
  color: string;
}) => {
  const cellWidth = ancho / columnas;
  const cellHeight = alto / filas;

  return (
    <rect
      x={x + columna * cellWidth}
      y={y + fila * cellHeight}
      width={cellWidth}
      height={cellHeight}
      fill={color}
      stroke="black"
      strokeWidth={1}
    />
  );
};


export function Tablero({ fichas, onFichaClick }: TableroProps) {
  const CAMINO_AZUL = { x: 290, y: 150, ancho: 220, alto: 140, filas: 7, columnas: 3 };
  const CAMINO_VERDE = { x: 150, y: 290, ancho: 140, alto: 220, filas: 3, columnas: 7 };
  const CAMINO_ROJO  = { x: 510, y: 290, ancho: 140, alto: 220, filas: 3, columnas: 7 };
  const CAMINO_AMARILLO = { x: 290, y: 510, ancho: 220, alto: 140, filas: 7, columnas: 3 };
  
  return (
    <svg width="800" height="800" className="border-4 border-gray-900 bg-white">
      <rect x="150" y="150" width="500" height="500" fill="lightblue" stroke="black" strokeWidth="2" />
      <rect x="340" y="340" width="120" height="120" fill="white" stroke="black" strokeWidth="2" />
      {/*Azul, Rojo, Verde, Amarillo */}
      <rect x="150" y="150" width="140" height="140" fill="#87CEFA" stroke="black" strokeWidth="2" />
      <rect x="510" y="150" width="140" height="140" fill="#FF6666" stroke="black" strokeWidth="2" />
      <rect x="150" y="510" width="140" height="140" fill="#50C878" stroke="black" strokeWidth="2" />
      <rect x="510" y="510" width="140" height="140" fill="#FFFFCC" stroke="black" strokeWidth="2" />
      {/* Zona central dividida */}
      <polygon points="290,150 436.6,150 436.6,340 340,340 340,363.3 150,363.3 150,290 290,290" fill="white" stroke="black" strokeWidth="1" />
      <polygon points="340,363.3 340,460 363.3,460 363.3,650 290,650 290,510 150,510 150,363.3" fill="white" stroke="black" strokeWidth="1" />
      <polygon points="363.3,650 363.3,460 460,460 460,436.6 650,436.6 650,510 510,510 510,650" fill="white" stroke="black" strokeWidth="1" />
      <polygon points="460,436.6 460,340 436.6,340 436.6,150 510,150 510,290 650,290 650,436.6" fill="white" stroke="black" strokeWidth="1" />

      {/*Mallas */}
      <DibujarMalla {...CAMINO_AZUL} />
      <DibujarMalla {...CAMINO_VERDE} />
      <DibujarMalla {...CAMINO_ROJO} />
      <DibujarMalla {...CAMINO_AMARILLO} />

      {/* Casillas especiales AZULES */}

      {/* Seguro azul (fila 0, columna 1 – ajusta si te queda corrido) */}
      <CasillaEspecial
        {...CAMINO_AZUL}
        fila={0}
        columna={1}
        color="#0000FF"
      />

      <CasillaEspecial
        {...CAMINO_VERDE}
        fila={0}
        columna={4}
        color="#0000FF"      
      />

      {/* Salida azul (coincide con el texto SALIDA azul) */}
      <CasillaEspecial
        {...CAMINO_AZUL}
        fila={4}
        columna={0}
        color="#0000FF"
      />

      {/* Casillas especiales VERDES */}

      
      {/* Seguro verde (fila 1, columna 2 – ajusta si te queda corrido) */}
      <CasillaEspecial
        {...CAMINO_VERDE}
        fila={1}
        columna={0}
        color="#00AA00"      
      />

      <CasillaEspecial
        {...CAMINO_AMARILLO}
        fila={2}
        columna={0}
        color="#00AA00"
      />
      

      {/* Salida verde (coincide con el texto SALIDA verde) */}
      <CasillaEspecial
        {...CAMINO_VERDE}
        fila={2}
        columna={4}
        color="#00AA00"
      />
      
      {/* Casillas especiales AMARILLAS */}
      {/* Seguro amarillo (fila 2, columna 1 – ajusta si te queda corrido) */}
      <CasillaEspecial
        {...CAMINO_AMARILLO}
        fila={6}
        columna={1}
        color="#FFFF00"
      />
      
      <CasillaEspecial
        {...CAMINO_ROJO}
        fila={2}
        columna={2}
        color="#FFFF00"
      />

      {/* Salida amarilla (coincide con el texto SALIDA amarillo) */}
      <CasillaEspecial
        {...CAMINO_AMARILLO}
        fila={2}
        columna={2}
        color="#FFFF00"
      />
      {/* Casillas especiales ROJAS */}
      {/* Seguro rojo (fila 1, columna 0 – ajusta si te queda corrido) */}
      <CasillaEspecial
        {...CAMINO_ROJO}
        fila={1}
        columna={6}
        color="#FF0000"
      />
      
      <CasillaEspecial
        {...CAMINO_AZUL}
        fila={4}
        columna={2}
        color="#FF0000"
      />
      {/* Salida roja (coincide con el texto SALIDA rojo) */}
      <CasillaEspecial
        {...CAMINO_ROJO}
        fila={0}
        columna={2}
        color="#FF0000"
      />
      

      {/* Zona central detallada */}
      <line x1="363.3" y1="290" x2="363.3" y2="340" stroke="black" strokeWidth="1.5" />
      <line x1="436.6" y1="290" x2="436.6" y2="340" stroke="black" strokeWidth="1.5" />
      <line x1="363.3" y1="460" x2="363.3" y2="510" stroke="black" strokeWidth="1.5" />
      <line x1="436.6" y1="460" x2="436.6" y2="510" stroke="black" strokeWidth="1.5" />

      <line x1="290" y1="363.3" x2="340" y2="363.3" stroke="black" strokeWidth="1.5" />
      <line x1="290" y1="436.6" x2="340" y2="436.6" stroke="black" strokeWidth="1.5" />
      <line x1="460" y1="363.3" x2="510" y2="363.3" stroke="black" strokeWidth="1.5" />
      <line x1="460" y1="436.6" x2="510" y2="436.6" stroke="black" strokeWidth="1.5" />

      <line x1="290" y1="290" x2="340" y2="340" stroke="black" strokeWidth="1.5" />
      <line x1="460" y1="340" x2="510" y2="290" stroke="black" strokeWidth="1.5" />
      <line x1="290" y1="510" x2="340" y2="460" stroke="black" strokeWidth="1.5" />
      <line x1="460" y1="460" x2="510" y2="510" stroke="black" strokeWidth="1.5" />

      {/* Zona central dividida */}
      <polygon points="340,340 400,400 460,340" fill="#0000FF" stroke="black" strokeWidth="1.5" />
      <polygon points="340,340 400,400 340,460" fill="#00AA00" stroke="black" strokeWidth="1.5" />
      <polygon points="340,460 400,400 460,460" fill="#FFFF00" stroke="black" strokeWidth="1.5" />
      <polygon points="460,460 400,400 460,340" fill="#FF0000" stroke="black" strokeWidth="1.5" />

      <line x1="340" y1="340" x2="460" y2="460" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
      <line x1="340" y1="460" x2="460" y2="340" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
      <circle cx="400" cy="400" r="4" fill="black" />

      <text x="325" y="244" fontSize="10" fill="black" fontWeight="bold" textAnchor="middle">
        SALIDA
      </text>
      <text x="574" y="356" fontSize="10" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(90 580 333)">
        SALIDA
      </text>
      <text x="245" y="482" fontSize="10" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(270 240 479)">
        SALIDA
      </text>
      <text x="473" y="563" fontSize="10" fill="black" fontWeight="bold" textAnchor="middle">
        SALIDA
      </text>

      <text x="400" y="163" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle">
        SEGURO
      </text>
      <text x="574" y="502" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(90 580 479)">
        SEGURO
      </text>
      <text x="641" y="411" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(90 645 403)">
        SEGURO
      </text>
      <text x="228" y="355" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(270 220 333)">
        SEGURO
      </text>
      <text x="160" y="411" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(270 155 403)">
        SEGURO
      </text>
      <text x="400" y="644" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle">
        SEGURO
      </text>
      <text x="325" y="562" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle">
        SEGURO
      </text>
      <text x="474" y="243" fontSize="9" fill="black" fontWeight="bold" textAnchor="middle">
        SEGURO
      </text>

      <text x="400" y="365" fontSize="11" fill="black" fontWeight="bold" textAnchor="middle">
        LLEGADA
      </text>
      <text x="435" y="403" fontSize="11" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(90 435 403)">
        LLEGADA
      </text>
      <text x="400" y="440" fontSize="11" fill="black" fontWeight="bold" textAnchor="middle">
        LLEGADA
      </text>
      <text x="365" y="403" fontSize="11" fill="black" fontWeight="bold" textAnchor="middle" transform="rotate(270 365 403)">
        LLEGADA
      </text>

      {fichas.map((f, i) => (
        <Ficha key={`${f.color}-${i}`} x={f.x} y={f.y} color={f.color} onClick={() => onFichaClick(i)} />
      ))}
    </svg>
  );
}
