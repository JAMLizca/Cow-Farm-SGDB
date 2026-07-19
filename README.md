# 🐄 SGDB — Sistema de Gestión de Bovinos

Sistema web multi-finca para la administración y control integral de información ganadera. Permite gestionar bovinos, producción de leche, eventos sanitarios, pesajes y usuarios, con acceso diferenciado por roles (administrador y empleado).

---

##  Descripción

El SGDB surge como solución a la problemática de desorganización en el manejo de información ganadera. Los ganaderos pueden centralizar todos los datos de su finca en un solo sistema accesible desde el navegador, eliminando el uso de registros manuales y hojas de cálculo dispersas.

Cada finca opera de forma completamente aislada mediante un código único de acceso. El sistema detecta automáticamente el rol del usuario al iniciar sesión y habilita únicamente las funciones correspondientes a su perfil.

----
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
