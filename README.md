# 🐄 SGDB — Sistema de Gestión de Bovinos

Sistema web multi-finca para la administración y control integral de información ganadera. Permite gestionar bovinos, producción de leche, eventos sanitarios, pesajes y usuarios, con acceso diferenciado por roles (administrador y empleado).

---

## 📋 Descripción

El SGDB surge como solución a la problemática de desorganización en el manejo de información ganadera. Los ganaderos pueden centralizar todos los datos de su finca en un solo sistema accesible desde el navegador, eliminando el uso de registros manuales y hojas de cálculo dispersas.

Cada finca opera de forma completamente aislada mediante un código único de acceso. El sistema detecta automáticamente el rol del usuario al iniciar sesión y habilita únicamente las funciones correspondientes a su perfil.

---

## ✨ Funcionalidades principales

### Administrador
- Gestión completa de bovinos (CRUD)
- Gestión de usuarios y empleados
- Registro y seguimiento de eventos sanitarios
- Módulo de reportes con gráficas (producción, estado del hato, peso por raza, eventos sanitarios)
- Gestión de lotes y razas

### Empleado
- Visualización del listado de bovinos
- Registro de producción de leche diaria
- Marcar eventos sanitarios como completados
- Registro de pesajes con historial y filtros

---

## 🛠️ Tecnologías utilizadas

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| PHP | 8.3.6 | Lenguaje del servidor |
| Laravel | 12.53.0 | Framework backend — arquitectura MVC |
| MySQL | 8.0.45 | Base de datos relacional |
| Eloquent ORM | Incluido en Laravel | Interacción con la base de datos |
| Laravel Sanctum | 4.x | Autenticación y seguridad |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura de las vistas |
| CSS3 | — | Estilos y diseño responsive |
| JavaScript (ES6+) | — | Lógica de interacción |
| Fetch API | Nativa | Consumo de la API REST |
| Chart.js | 4.x | Gráficas de reportes |

---

## 🗄️ Estructura de la base de datos

El sistema cuenta con 9 tablas principales:

```
fincas
usuarios
razas
lotes
bovinos
produccion_leche
pesajes
eventos_sanitarios
alimentacion
```

Todas las tablas incluyen `finca_id` como clave foránea para garantizar el aislamiento de datos entre fincas.

---

## 📁 Estructura del proyecto

```
Sistema_De_Gestion_De_Bovinos/
├── app/
│   ├── Http/
│   │   └── Controllers/         ← Controladores de la API
│   └── Models/                  ← Modelos Eloquent
├── database/
│   └── migrations/              ← Migraciones de tablas
├── routes/
│   ├── api.php                  ← Endpoints REST
│   └── web.php
├── public/
│   ├── index.html               ← Login
│   ├── dashboard-admin.html     ← Dashboard administrador
│   ├── dashboard-empleado.html  ← Dashboard empleado
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js               ← Funciones de consumo API
│   │   ├── auth.js              ← Lógica de autenticación
│   │   ├── dashboard.js         ← Lógica del admin
│   │   └── dashboard_empleado.js
│   └── img/
│       └── Logo_SGDB.png
└── .env                         ← Variables de entorno
```

---

## ⚙️ Instalación local

### Requisitos previos

- Editor de código de preferencia (vs code)
- PHP 8.2 o superior
- Composer
- MySQL 8.x
- Node.js (para assets)
- Servidor local: XAMPP
- Postman
- Git

---

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/JAMLizca/Cow-Farm-SGDB
cd sgdb
```

---

### Paso 2 — Instalar dependencias de PHP

```bash
composer install
```

---

### Paso 3 — Configurar el archivo de entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
```

Abre `.env` y configura la conexión a la base de datos:

```env
APP_NAME=SGDB
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sgdb
DB_USERNAME=root
DB_PASSWORD=
```

---


---

### Paso 4 — Crear la base de datos

Abre phpMyAdmin o tu cliente de base de datos favorito y crea una base de datos llamada `sgdb` con cotejamiento `utf8mb4_unicode_ci`.

---

### Paso 5 — Ejecutar las migraciones

Abre el proyecto en tu editor de código favorito; te recomiendo VS Code. Luego, abre una terminal desde el mismo editor y asegúrate de estar dentro de la carpeta del proyecto. Ejecuta el siguiente comando:

```bash
php artisan migrate
```

---

Repite el mismo proceso para los pasos 6, 7 y 8.

### Paso 6 — Instalar Sanctum

```bash
php artisan install:api
php artisan migrate
```

---

### Paso 7 — Crear datos de prueba

Abre la consola de Laravel:

```bash
php artisan tinker
```

Crea una finca de prueba:

```php
use App\Models\Finca;
use Illuminate\Support\Facades\Hash;

Finca::create([
    'codigo_finca' => 'FINCA001',
    'nombre'       => 'La Esperanza',
    'password'     => Hash::make('123456'),
    'propietario'  => 'Juan Perez',
    'activo'       => true,
]);
```

Crea un usuario administrador:

```php
use App\Models\Usuario;

Usuario::create([
    'finca_id' => 1,
    'nombre'   => 'Carlos',
    'password' => Hash::make('admin123'),
    'rol'      => 'admin',
    'activo'   => true,
]);
```

Sal de tinker:

```php
exit
```

---

### Paso 8 — Iniciar el servidor de Laravel

```bash
php artisan serve
```

Elproyecto estará disponible en: `http://127.0.0.1:8000/index.html`

---

## 🔑 Credenciales de prueba

| Campo | Valor |
|---|---|
| Código de Finca | `FINCA001` |
| Usuario Admin | `Carlos` |
| Contraseña Admin | `admin123` |

Para crear un empleado de prueba desde Postman:

```json
POST http://127.0.0.1:8000/api/usuarios

{
    "finca_id": 1,
    "nombre": "Maria",
    "password": "emp123",
    "rol": "empleado",
    "activo": true
}
```

---

## 🌐 API REST — Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/login` | Iniciar sesión |
| GET | `/api/bovinos?finca_id=1` | Listar bovinos |
| POST | `/api/bovinos` | Registrar bovino |
| PUT | `/api/bovinos/{id}` | Actualizar bovino |
| DELETE | `/api/bovinos/{id}` | Eliminar bovino |
| GET | `/api/usuarios?finca_id=1` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| GET | `/api/produccion-leche?finca_id=1` | Listar producción |
| POST | `/api/produccion-leche` | Registrar producción |
| GET | `/api/pesajes?finca_id=1` | Listar pesajes |
| POST | `/api/pesajes` | Registrar pesaje |
| GET | `/api/eventos-sanitarios?finca_id=1` | Listar eventos |
| POST | `/api/eventos-sanitarios` | Registrar evento |
| GET | `/api/razas` | Listar razas |
| GET | `/api/lotes?finca_id=1` | Listar lotes |

---

## 👥 Roles del sistema

| Rol | Descripción |
|---|---|
| **Admin** | Acceso total — gestiona bovinos, usuarios, eventos sanitarios y reportes |
| **Empleado** | Acceso limitado — registra producción de leche, pesajes y marca eventos como completados |

---

## 📄 MIT License

Copyright (c) 2026 **Jose Alejandro Montenegro**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
