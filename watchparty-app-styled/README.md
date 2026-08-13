# WatchParty

Prototipo web responsive para Laboratorio 4.

## Ejecutar localmente

Requiere Node.js 22.

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## Deploy en Vercel

1. Subí este proyecto a GitHub.
2. Importá el repositorio en Vercel.
3. Vercel debería detectar **Next.js** automáticamente.
4. No hace falta configurar un Build Command personalizado: usa `npm run build`.

## Diseño

El sistema visual está documentado en `DESIGN_SYSTEM.md`.

- Dark UI
- Primary: `#5EE85A`
- Background: `#080D16`
- Cards: `#131D2C`
- Títulos: Sora
- Interfaz/texto: Inter
- Iconos: Lucide

## Temas
El prototipo incluye Dark Mode y Light Mode. El usuario puede alternarlos desde el botón Sol/Luna de la barra superior. La elección queda persistida en el navegador y, si no existe una preferencia guardada, se toma el tema del sistema operativo.

## Navegación actual
El prototipo usa cuatro pestañas principales:
- **Inicio:** sala del equipo favorito en la parte superior + feed social.
- **Salas:** directorio de salas de partidos.
- **Buscar:** buscador unificado de equipos, partidos y usuarios.
- **Perfil:** historial, equipo favorito, logros y cuenta del usuario.

La pantalla interna de una sala se abre desde Inicio, Salas o Buscar y mantiene **Salas** como sección activa. El acceso al perfil está únicamente en la navegación principal; en la esquina superior derecha se muestra el botón global de **Cerrar sesión**.
