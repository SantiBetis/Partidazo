⚽ Partidazo - Plataforma Social de Actividades Deportivas
👨‍💻 Autor: Santiago Pérez Olivares

---

## 📖 Índice
- [📌 Introducción](#-introducción)
- [🚀 Funcionalidades y Tecnologías](#-funcionalidades-y-tecnologías)
- [🛠️ Instalación](#️-instalación)
- [📱 Guía de Uso](#-guía-de-uso)
- [🎥 Demo](#-demo)
- [📸 Capturas de Pantalla](#-capturas-de-pantalla)
- [📌 Conclusión y Posibles Mejoras](#-conclusión-y-posibles-mejoras)
- [🤝 Contribuciones](#-contribuciones)
- [📜 Licencia](#-licencia)
- [📧 Contacto](#-contacto)

---

## 📌 Introducción
**Partidazo** es una aplicación web full-stack que funciona como red social deportiva. Permite a los usuarios **crear, buscar y unirse a actividades deportivas** cercanas, fomentando la práctica del deporte en comunidad.

### 🎯 Objetivos:
✔️ Conectar personas interesadas en practicar deportes juntas  
✔️ Permitir la creación y búsqueda de actividades deportivas por ubicación  
✔️ Integración con mapas (Google Maps) para visualizar actividades cercanas  
✔️ Sistema de chat en tiempo real para cada actividad  
✔️ Sistema de notificaciones y seguimiento entre usuarios  
✔️ Diseño responsivo optimizado para vista móvil  

### 💡 Motivación:
Encontrar compañeros para practicar deportes puede ser complicado. **Partidazo** centraliza la creación y búsqueda de actividades deportivas, facilitando que personas con intereses similares se conecten y practiquen deporte juntas.

---

## 🚀 Funcionalidades y Tecnologías

### 🔹 Funcionalidades principales:
✅ **Autenticación y registro** de usuarios con bcrypt  
✅ **Creación de actividades deportivas** (fútbol, baloncesto, tenis, pádel, voleibol)  
✅ **Búsqueda y filtrado** por deporte, nivel de habilidad y distancia  
✅ **Mapa interactivo** con ubicaciones de actividades en tiempo real  
✅ **Sistema de unirse/retirarse** de actividades con límite de participantes  
✅ **Chat en tiempo real** con Socket.IO para cada actividad  
✅ **Sistema de notificaciones** (nuevos participantes, seguidores)  
✅ **Perfiles de usuario** con seguimiento (followers/following)  
✅ **Geolocalización** con GPS y fallback a IP  
✅ **Carga de imágenes** a Cloudinary  

### 🛠 Tecnologías utilizadas:

#### 🎨 Frontend (React)
- **React 18** con Hooks (useState, useEffect, useContext)
- **React Router** para navegación
- **Styled Components** para estilos CSS-in-JS
- **Google Maps API** (@react-google-maps/api)
- **Socket.IO Client** para chat en tiempo real
- **Material-UI** para componentes (CircularProgress, DatePicker)
- **Moment.js** para manejo de fechas
- **React Icons** (Feather Icons, Hero Icons)

#### 🖥 Backend (Node.js + Express)
- **Express.js** como servidor web
- **MongoDB Atlas** como base de datos NoSQL
- **Socket.IO** para chat en tiempo real
- **Express-Session** para manejo de sesiones
- **Bcrypt** para hash de contraseñas
- **UUID** para generación de IDs únicos
- **Dotenv** para variables de entorno
- **CORS** para comunicación cliente-servidor

#### 🗄️ Base de Datos (MongoDB)
- **Colección users**: información de usuarios, seguidores, notificaciones
- **Colección posts**: actividades deportivas con participantes y mensajes
- **Datos en español**: deportes y niveles almacenados en español

---

## 🛠️ Instalación

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/SantiBetis/Partidazo.git
cd Partidazo
```

### 2️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `server/` con:
```env
MONGO_URI=tu_mongodb_atlas_connection_string
SESSION_SECRET=tu_session_secret_key
PORT=8000
```

### 3️⃣ Instalar Dependencias

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 4️⃣ Configurar MongoDB Atlas
1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una base de datos llamada `Partidazo`
3. Crea dos colecciones: `users` y `posts`
4. Copia la cadena de conexión a tu archivo `.env`

### 5️⃣ Configurar Google Maps API
1. Obtén una API Key de [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita las APIs: Maps JavaScript API, Geocoding API, Places API
3. Reemplaza la API key en `client/public/index.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places"></script>
```

### 6️⃣ Ejecutar el Backend
```bash
cd server
npm start
```
El servidor estará en: `http://localhost:8000`  
📖 **Documentación API (Swagger)**: `http://localhost:8000/api-docs`

### 7️⃣ Ejecutar el Frontend
```bash
cd client
npm start
```
La aplicación estará en: `http://localhost:3000`

---

## 📱 Guía de Uso

### 1️⃣ Registro e Inicio de Sesión
- Crea una cuenta con email, contraseña, nombre y ubicación
- Sube una foto de perfil (opcional)
- Inicia sesión con tus credenciales

### 2️⃣ Explorar Actividades
- **Vista de Lista**: Visualiza todas las actividades disponibles
- **Vista de Mapa**: Explora actividades en un mapa interactivo
- **Filtros**: Filtra por deporte (Fútbol, Baloncesto, etc.) y nivel (Principiante, Avanzado, etc.)
- **Orden por distancia**: Las actividades se ordenan por cercanía a tu ubicación

### 3️⃣ Crear una Actividad
- Haz clic en el botón "Crear Actividad"
- Completa el formulario:
  - Tipo de deporte
  - Nivel requerido
  - Fecha y hora (inicio y fin)
  - Ubicación (búsqueda con autocompletado de Google Places)
  - Límite de participantes
  - Descripción
- Publica la actividad

### 4️⃣ Unirse a una Actividad
- Explora actividades disponibles
- Haz clic en "Unirse" para participar
- Accede al chat en tiempo real de la actividad
- Retírate si cambias de opinión (antes de que expire)

### 5️⃣ Sistema Social
- **Perfil**: Visualiza tu perfil y actividades (creadas y participando)
- **Seguir usuarios**: Sigue a otros deportistas
- **Notificaciones**: Recibe alertas cuando alguien se une a tu actividad o te sigue
- **Chat**: Comunícate con otros participantes en tiempo real

---

### 🔮 Mejoras Futuras:
🔹 **PWA (Progressive Web App)**: Convertir la app en PWA para instalación móvil y funcionamiento offline  
🔹 **Notificaciones Push**: Alertas en tiempo real fuera de la aplicación  
🔹 **Integración con Redes Sociales**: Login con Google
🔹 **Sistema de Valoraciones**: Permitir que usuarios valoren actividades y participantes  
🔹 **Actividades Recurrentes**: Crear actividades que se repiten semanalmente  
🔹 **Modo Oscuro**: Implementar tema oscuro para mejor experiencia nocturna  
🔹 **Multiidioma**: Soporte para inglés y otros idiomas  
🔹 **Optimización de Rendimiento**: Implementar lazy loading y code splitting  
🔹 **Tests Automatizados**: Añadir Jest y React Testing Library  

Este proyecto demostró la importancia de la documentación del código, el manejo de estados complejos en React, y la integración de servicios externos como Google Maps y Socket.IO.

---

## 🤝 Contribuciones

Si deseas contribuir a este proyecto, ¡eres bienvenido! 🚀

1. Haz un **fork** del repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commitea** tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

🔗 **Repositorio**: [GitHub - Partidazo](https://github.com/SantiBetis/Partidazo)

---

## 📧 Contacto

👨‍💻 **Santiago Pérez Olivares**  
📧 Email: santiago.perez.olivares.16@gmail.com

Si tienes dudas, sugerencias o quieres colaborar, ¡contáctame! 📩

---

**⭐ Si te gusta el proyecto, dale una estrella en GitHub ⭐**

