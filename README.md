# slidingpuzzle
![image](https://github.com/user-attachments/assets/02cfd696-ce58-4802-99d3-b500bb351930)

Sliding Puzzle con Carga de Foto Personalizada
Este proyecto es una implementación de un puzzle deslizante donde los usuarios pueden subir su propia foto para usarla como imagen del puzzle. El juego divide la imagen en varias piezas que deben ser reordenadas en el tablero deslizándolas hasta resolver el puzzle.

Características
Carga de imagen personalizada: Permite al usuario cargar cualquier imagen desde su dispositivo para crear el puzzle.
Piezas deslizantes: Divide la imagen en una cuadrícula de piezas deslizantes, con una casilla vacía para permitir los movimientos.
Interfaz interactiva: Utiliza componentes y estilos modernos para una experiencia de usuario agradable.
Mensajes de notificación: Muestra notificaciones al usuario con toast al iniciar y al completar el puzzle.
Configuración del tamaño del puzzle: Ajustable para diferentes niveles de dificultad (ej., 3x3, 4x4, etc.).
Tecnologías
Next.js para el servidor y la interfaz de usuario.
React para la construcción de componentes interactivos.
ShadCN UI para las notificaciones y otros componentes de UI.
Canvas para el procesamiento de imágenes y la creación de piezas del puzzle.
Lucide Icons para iconos visualmente atractivos.
Canvas-Confetti para animaciones de celebración al resolver el puzzle.
Instalación
Clona el repositorio:

bash
Copiar código
git clone https://github.com/usuario/sliding-puzzle
cd sliding-puzzle
Instala las dependencias:

bash
Copiar código
npm install
Ejecuta el proyecto:

bash
Copiar código
npm run dev
Abre http://localhost:3000 en tu navegador para ver el proyecto.

Uso
Cargar Imagen: Al inicio, selecciona una imagen para el puzzle. La imagen se cortará en piezas cuadradas según el tamaño del tablero elegido.

Seleccionar Dificultad: Usa el deslizador para ajustar la dificultad (por ejemplo, de 3x3 a 5x5 piezas).

Resolver el Puzzle: Haz clic o desliza las piezas para reordenarlas y restaurar la imagen original.

Celebración: Una animación de confeti y un mensaje de felicitación aparecerán al completar el puzzle.

Componentes Principales
PuzzleBoard: Componente que representa el tablero del puzzle y controla el movimiento de las piezas.
ImageUploader: Permite al usuario cargar y previsualizar una imagen antes de crear el puzzle.
Slider: Para seleccionar la dificultad del puzzle ajustando el tamaño de la cuadrícula.
Toast Notifications: Muestra notificaciones al usuario, como mensajes de éxito al resolver el puzzle.
Personalización
Para cambiar el tamaño predeterminado del puzzle o los colores de la interfaz, puedes modificar las variables de configuración en el archivo config.js.

Problemas Comunes
Módulos no encontrados: Si recibes errores de módulos faltantes como @/components/ui/use-toast o canvas-confetti, asegúrate de que todos los paquetes estén instalados y configurados correctamente.
Imagen no visible en el puzzle: Asegúrate de que la imagen cargada sea de un formato compatible, como JPG o PNG.
Contribución
Haz un fork del proyecto.
Crea una rama nueva (git checkout -b feature-nueva-funcionalidad).
Realiza los cambios y confirma los cambios (git commit -m 'Añadir nueva funcionalidad').
Sube tu rama (git push origin feature-nueva-funcionalidad).
Abre un Pull Request.
