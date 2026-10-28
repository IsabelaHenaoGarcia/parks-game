# Parqués Client (Next.js + React-Konva)

Cliente web del tablero de Parqués para conectarse al backend en Python. La meta de esta primera versión es tener el tablero dibujado, fichas arrastrables y un punto claro para enchufar la lógica de juego.

## Requisitos
- Node.js 18+
- npm (o pnpm/yarn)
- git

## Instalación y arranque rápido
```bash
npm install
npm run dev
# abre http://localhost:3000
```

Deberías ver un tablero beige, algunas casillas de ejemplo y dos fichas que se pueden arrastrar.

## Estructura relevante
```
app/
  page.tsx                 # Monta ParquesBoard centrado
components/board/
  ParquesBoard.tsx         # Stage + capas; estado local de fichas
  BoardGrid.tsx            # Dibuja base y casillas
  Piece.tsx                # Ficha draggable
  boardLayout.ts           # Constantes de layout (BOARD_SIZE, CELL_SIZE, casillas)
  types.ts                 # Tipos: PlayerColor, BoardCell, PieceState
```

## Cómo está armado
- **Konva/React-Konva**: Stage (lienzo) > Layer (capas) > Rect/Circle (shapes).
- **Capa tablero**: `BoardGrid` pinta fondo y casillas desde `baseCells` en `boardLayout.ts`.
- **Capa fichas**: `ParquesBoard` renderiza fichas (`Piece`) y maneja drag con estado local.
- **Hook de arrastre**: en `handlePieceDragEnd` (ParquesBoard) se actualizará posición y luego llamará al backend para validar.

## Arquitectura y reglas (resumen operativo)
- Tablero de 95 casillas, 12 seguras, 4 cárceles. Zonas por color (rojo, azul, amarillo, verde), cada una con casilla de salida y casilla segura antes de su subida a meta.
- Jugadores avanzan desde su esquina de salida, recorren el circuito, atraviesan casillas seguras, suben por su tramo de meta y ganan al llegar todas sus fichas.
- Fichas en casilla no segura pueden ser enviadas a la cárcel por fichas de otro color. Dos fichas del mismo color bloquean el paso.
- Dados: dos de 6 caras. Tiradas pares permiten sacar ficha o repetir turno; tres pares seguidos envían a cárcel. Movimientos pueden repartirse entre fichas (dado1/dado2 o suma).

## Próximos pasos / TODO
1) **Layout real**: reemplazar `baseCells` en `components/board/boardLayout.ts` con las 95 casillas reales: coordenadas, color de zona, flags `isSafe`, `isStart`, `isHome`, cárceles y subida a meta por color.
2) **Escalado responsivo**: opcional, ajustar tamaño del `Stage` y aplicar `scaleX/scaleY` según viewport.
3) **Capas separadas**: mantener tablero y fichas en `Layer` distintos (ya hay dos).
4) **Labels/debug**: opcional, agregar `Text` para identificar casillas especiales mientras se calibra el layout.
5) **Conexión backend Python**:
   - En `handlePieceDragEnd`, hacer `fetch` a la API: enviar ficha, origen/destino (o delta), tirada, turno.
   - Backend devuelve estado validado (posiciones, turno, eventos). Actualizar `pieces` con la respuesta o revertir si es inválido.
   - Añadir handlers para lanzar dados y sacar ficha de cárcel siguiendo las reglas descritas.
6) **Reglas adicionales**: bloqueo de dos fichas propias, envío a cárcel al caer en salida ocupada de otro color, control de tres pares seguidos, etc. (lógica en backend).

## Puntos de integración con backend
- `ParquesBoard.tsx`: función `handlePieceDragEnd` es el hook natural para validar movimientos.
- Añadir botones/acciones (tirar dados, sacar de cárcel) que llamen a endpoints Python y refresquen estado de fichas/turno.
- Estado de tablero y turno debería venir “como verdad” desde el backend; el frontend solo renderiza y muestra restricciones de drag según respuesta.

## Comandos útiles
- `npm run dev` — modo desarrollo
- `npm run build` — build de producción
- `npm start` — servir build
- `npm run lint` — lint

## Checklist para onboarding de tu compañero
- [ ] `npm install`
- [ ] `npm run dev` y verificar tablero simple + fichas arrastrables
- [ ] Completar `boardLayout.ts` con el layout real
- [ ] Implementar llamadas al backend en `handlePieceDragEnd` y futuros botones (dados/cárcel)
- [ ] Probar flujo básico: mover fichas, validar respuestas del backend, asegurar que los estados coinciden con reglas
