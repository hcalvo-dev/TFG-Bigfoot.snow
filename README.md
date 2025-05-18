
# 🏔️ Bigfoot.Snow – Proyecto TFG

Aplicación web para la gestión de alquiler de equipos de nieve y reservas de clases con instructores. Este proyecto utiliza **Astro** como solución integral, combinando frontend y backend mediante endpoints, y gestionando los datos con **PostgreSQL + Prisma**. El entorno de desarrollo incluye contenedores Docker para facilitar la portabilidad y el despliegue.

---

## 🚀 Estructora de Proyecto

Dentro del proyecto de Astro, encontraremos los siguientes directorios y ficheros:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

## 🧞 Commands

Todos los comandos necesarios para arrancar el proyecto, desde la términal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## ✅ Estado actual

- [x] Estructura inicial del proyecto creada
- [x] Astro funcionando con Tailwind CSS
- [x] PostgreSQL y pgAdmin dockerizados
- [x] Prisma configurado y en funcionamiento
- [x] Endpoint `/api/usuarios` creado para lectura desde la base de datos

---

## 🧩 Desarrollo de funcionalidades

### 🔁 Conexión e interacción con base de datos

- [x] Crear archivo `.env` con `DATABASE_URL`
- [x] Definir el modelo `Usuario` en Prisma
- [x] Sincronizar con `npx prisma db push`
- [x] Probar consulta desde endpoint `/api/usuarios`
- [X] Crear formulario básico para insertar nuevos usuarios
- [X] Implementar endpoint `POST` para insertar datos desde formulario
- [X] Añadir más modelos: `Reserva`, `Instructor`, `Producto`, `Categoría`, etc.
- [X] Crear relaciones entre tablas en `schema.prisma`
- [X] Añadir validaciones a los datos recibidos

---

### 🧑‍💻 Interfaz de usuario y experiencia

- [x] Estructura inicial de componentes (layouts, páginas)
- [x] Carga de estilos globales con Tailwind
- [X] Crear navegación principal (Home, Reservas, Alquiler, Contacto)
- [ ] Diseñar vista de productos con tarjetas
- [X] Implementar vista de reservas disponibles
- [X] Adaptar diseño a dispositivos móviles (responsive)

---

### 🛠️ Infraestructura y despliegue

- [x] Docker Compose para PostgreSQL y pgAdmin
- [ ] Añadir Dockerfile para app Astro
- [ ] Ampliar `docker-compose.yml` para incluir Astro
- [ ] Preparar entorno de producción
- [ ] Configurar VPS con Ubuntu + Docker
- [ ] Desplegar aplicación completa en VPS

---

### 🔌 Funcionalidades adicionales

- [X] Integración con API meteorológica para mostrar estado de la nieve
- [X] Sistema de reservas con control de fechas y disponibilidad
- [ ] Envío de correos de confirmación al reservar
- [X] Añadir sistema de autenticación de usuarios (login/registro)
- [X] Panel de administración para gestionar instructores, productos y reservas

---

## 🧠 Notas de desarrollo

- Se trabaja desde Ubuntu con WSL2 para asegurar compatibilidad con el entorno de producción.
- La base de datos se gestiona desde pgAdmin: [http://localhost:5050](http://localhost:5050)
- Prisma Client se genera automáticamente al hacer `prisma db push`.
- La estructura está basada en Astro con endpoints integrados, sin separar backend y frontend.

---

## ✨ Autor

**Héctor Calvo Sánchez**  
Estudiante de 2º DAW – Proyecto de Fin de Grado 2025  

