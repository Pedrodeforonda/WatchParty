# WatchParty Design System

**Concepto:** Football × Social × Live

## Tipografía
- Títulos: Sora (600–700)
- Interfaz y texto: Inter (400–800)

## Colores
- Background principal: `#080D16`
- Background secundario: `#0D1421`
- Cards: `#131D2C`
- Card hover: `#192638`
- Bordes: `#253247`
- Primary / WatchParty: `#5EE85A`
- Primary hover: `#4CD148`
- Texto principal: `#F8FAFC`
- Texto secundario: `#94A3B8`
- Texto muted: `#64748B`
- Live / error: `#F04444`
- Warning: `#F59E0B`
- Info: `#3B82F6`

## Radios
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 20px

## Reglas
- El verde identifica marca, CTA, selección y ratings.
- El rojo se reserva para LIVE, alertas y errores.
- Los colores de los clubes aparecen sólo en elementos propios de los equipos.
- Sombras sutiles; la jerarquía se construye principalmente con superficies y bordes.
- Lucide Icons como set principal de iconografía.
- Animaciones cortas (150ms) y discretas.

## Dark mode / Light mode
WatchParty soporta dos temas completos. El selector aparece en la barra superior y en la pantalla de acceso.

### Dark mode — tema principal
- Background: `#080D16`
- Background secundario: `#0D1421`
- Surface: `#131D2C`
- Surface hover: `#192638`
- Border: `#253247`
- Primary: `#5EE85A`
- Primary hover: `#4CD148`
- Texto principal: `#F8FAFC`
- Texto secundario: `#94A3B8`
- Texto muted: `#64748B`

### Light mode — variante accesible
- Background: `#F4F7F5`
- Background secundario: `#FFFFFF`
- Surface: `#FFFFFF`
- Surface hover: `#EDF3EF`
- Border: `#D4DFD7`
- Primary: `#178A3E`
- Primary hover: `#116F32`
- Texto principal: `#111A15`
- Texto secundario: `#526159`
- Texto muted: `#748078`

El verde del modo claro es más profundo que el verde eléctrico del modo oscuro para mantener contraste suficiente sobre superficies blancas.

### Comportamiento
- Si el usuario ya eligió un tema, la preferencia se guarda en `localStorage` bajo `watchparty-theme`.
- Si todavía no eligió uno, se respeta `prefers-color-scheme` del sistema.
- El cambio de tema actualiza `color-scheme` del navegador.
- Se evita el flash inicial del tema incorrecto mediante un script previo a la hidratación.
- El control usa iconos `Sun` / `Moon` de Lucide.
- Las animaciones respetan `prefers-reduced-motion`.
