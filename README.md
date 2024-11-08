# slidingpuzzle
![image](https://github.com/user-attachments/assets/02cfd696-ce58-4802-99d3-b500bb351930)

# Puzzle Sliding con Foto Personalizada

Este proyecto es una aplicación de puzzle deslizante (sliding puzzle) en la que los usuarios pueden subir una foto personalizada que se dividirá en piezas para formar el rompecabezas. El objetivo del juego es reorganizar las piezas deslizantes hasta recomponer la imagen original.

## Características

- **Subida de Foto Personalizada**: Los usuarios pueden subir una imagen propia que se divide en piezas de puzzle.
- **Ajuste de Dificultad**: Configura el tamaño del puzzle (3x3, 4x4, 5x5).
- **Contador de Movimientos y Tiempo**: Monitorea el tiempo y la cantidad de movimientos realizados.
- **Animación de Confeti**: Felicitación visual con confeti al resolver el puzzle.

## Tecnologías Utilizadas

- **Next.js**: Framework de React para el desarrollo de la aplicación web.
- **React**: Librería de JavaScript para la construcción de la interfaz de usuario.
- **Canvas-confetti**: Librería para efectos visuales de confeti.
- **ShadCN UI**: Componentes de interfaz de usuario personalizados.
- **Lucide-react**: Conjunto de iconos para mejorar la experiencia visual.

## Instalación

### Prerrequisitos

Asegúrate de tener **Node.js** y **npm** instalados en tu sistema. Puedes instalar Node.js desde [nodejs.org](https://nodejs.org/).

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jhonja999/slidingpuzzle.git
Navega al directorio del proyecto:

bash
Copiar código
cd tu-repositorio
Instala las dependencias:

bash
Copiar código
npm install
Configuración Adicional de ShadCN UI
Asegúrate de haber instalado todos los componentes necesarios de ShadCN UI para el proyecto:

bash
Copiar código
npx shadcn add toast dialog button slider
Iniciar el Proyecto
Inicia la aplicación localmente:

bash
Copiar código
npm run dev
Abre http://localhost:3000 en tu navegador para ver la aplicación en funcionamiento.

Uso
Sube una imagen desde tu dispositivo para iniciar el puzzle.
Selecciona el tamaño del rompecabezas desde las opciones (ejemplo: 3x3, 4x4, 5x5).
Resuelve el puzzle reorganizando las piezas.
Una vez que el puzzle esté completo, recibirás una animación de confeti como felicitación.
