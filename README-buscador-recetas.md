# Buscador de Recetas 🍳

![Buscador de Recetas Demo](https://placehold.co/900x500/1e293b/94a3b8?text=Buscador+de+Recetas+Demo)

> Aplicación web para buscar recetas por nombre o ingrediente, con información detallada de cada plato obtenida desde una API externa.

---

## Demo en vivo

🔗 **[Ver demo en vivo](https://boatingboat271.github.io/EF-M4-Proyecto-Sprint-2/)**

---

## Descripción

Buscador de Recetas es una SPA (Single Page Application) que consume una API pública de recetas. Permite al usuario buscar platos por nombre o ingrediente y visualizar los detalles completos: ingredientes, cantidades e instrucciones paso a paso. Demuestra el manejo de solicitudes HTTP asíncronas, estado del componente y renderizado dinámico.

**Funcionalidades principales:**
- Búsqueda en tiempo real por nombre o ingrediente
- Visualización de imagen, ingredientes e instrucciones
- Manejo de errores y estados de carga
- Diseño responsive

---

## Tecnologías utilizadas

| Tecnología  | Uso                                      |
|-------------|------------------------------------------|
| JavaScript  | Lógica de la aplicación                 |
| React       | Componentización y manejo de estado     |
| CSS3        | Estilos y diseño responsive             |
| REST API    | Consumo de datos de recetas externas    |

---

## Instalación y uso

### Requisitos previos
- Node.js v18 o superior
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/BoatingBoat271/EF-M4-Proyecto-Sprint-2.git

# 2. Ingresar al directorio
cd buscador-recetas

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Luego abre tu navegador en `http://localhost:5173` (o el puerto indicado en consola).

---

## Variables de entorno

Si la API require una API Key, crea un archivo `.env` en la raíz:

```env
VITE_API_KEY=tu_clave_aqui
```

> Nunca subas el archivo `.env` a GitHub. Asegúrate de que esté en tu `.gitignore`.

---

## Autor

**Pablo** — [GitHub](https://github.com/TU_USUARIO) · [LinkedIn](https://linkedin.com/in/TU_USUARIO) · [Portfolio](TU_LINK_PORTFOLIO)
