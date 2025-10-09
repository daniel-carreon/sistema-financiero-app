# 💰 Sistema Financiero

**Sistema de gestión financiera con análisis inteligente y reportes interactivos**

Un dashboard moderno y completo para el seguimiento de transacciones financieras, análisis de datos y generación de reportes con asistencia de IA.

---

## 🚀 Características

### 📊 Dashboard Interactivo
- KPIs en tiempo real (Ingresos, Gastos, Balance)
- Visualización de tendencias con gráficas dinámicas
- Vistas configurables: Diaria, Semanal, Mensual, Personalizada
- Tema claro/oscuro con preferencias persistentes

### 📈 Reportes Avanzados
- Generación automática de reportes financieros
- Análisis de tendencias y patrones
- Exportación de datos
- Visualizaciones con Chart.js y Mermaid

### 🤖 Agente IA
- Chat interactivo con asistente financiero
- Análisis de datos con OpenRouter (GPT-4o-mini)
- Recomendaciones personalizadas
- Procesamiento de imágenes (tickets, recibos)

### 📁 Gestión de Datos
- Carga de archivos Excel/CSV
- Procesamiento de imágenes (OCR)
- Registro manual de transacciones
- Corte diario automatizado

### 🔐 Autenticación
- Sistema de login seguro con Supabase
- Gestión de usuarios y roles
- Protección de rutas

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js, react-chartjs-2
- **Icons**: Lucide React
- **Diagrams**: Mermaid

### Backend & Database
- **BaaS**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

### AI & APIs
- **Chat**: OpenRouter (GPT-4o-mini)
- **Image Processing**: OpenRouter Vision Models

---

## 📦 Instalación

### Prerrequisitos
- Node.js 20+ y npm
- Cuenta de Supabase
- API Key de OpenRouter (opcional, para funciones de IA)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/daniel-carreon/sistema-financiero-app.git
cd sistema-financiero-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenRouter (opcional)
OPENROUTER_API_KEY=your-openrouter-api-key
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗃️ Configuración de Supabase

### Tablas necesarias

**transacciones**
```sql
CREATE TABLE transacciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha TIMESTAMP NOT NULL,
  concepto TEXT NOT NULL,
  categoria TEXT,
  monto DECIMAL(10, 2) NOT NULL,
  tipo TEXT CHECK (tipo IN ('ingreso', 'gasto')),
  usuario_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**usuarios** (opcional, para metadata adicional)
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nombre TEXT,
  email TEXT UNIQUE,
  rol TEXT DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Buckets

Crear bucket `uploads` para almacenamiento de archivos:
- Imágenes de tickets/recibos
- Archivos Excel/CSV

---

## 📁 Estructura del Proyecto

```
sistema-financiero/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Dashboard principal
│   ├── login/               # Página de login
│   ├── registro/            # Registro de transacciones
│   ├── corte-diario/        # Corte diario
│   ├── upload-excel/        # Carga de Excel
│   ├── agente-mejorado/     # Chat con IA
│   └── api/                 # API Routes
│       ├── auth/            # Autenticación
│       ├── transacciones/   # CRUD transacciones
│       ├── chat/            # Endpoints de chat
│       └── upload-*/        # Subida de archivos
├── components/              # Componentes React
│   ├── Header.tsx          # Barra de navegación
│   ├── KPICard.tsx         # Tarjetas de métricas
│   ├── TrendChart.tsx      # Gráficas de tendencias
│   ├── DataViews.tsx       # Vistas de datos
│   └── ThemeToggle.tsx     # Selector de tema
├── hooks/                   # Custom React hooks
│   ├── useEnhancedChat.ts  # Chat con streaming
│   └── useImageUpload.ts   # Upload de imágenes
├── lib/                     # Utilidades
│   └── supabase.ts         # Cliente de Supabase
├── .claude/                 # Configuración Claude Code
└── CLAUDE.md               # Guías de desarrollo con IA
```

---

## 🎨 Desarrollo

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run start    # Servidor de producción
```

### Características de desarrollo

- **Hot Reload**: Cambios instantáneos en desarrollo
- **TypeScript**: Tipado estático completo
- **ESLint**: Linting automático
- **Dark Mode**: Sistema de temas con next-themes

### Claude Code Integration

Este proyecto está optimizado para desarrollo asistido por IA:

- **CLAUDE.md**: Guías de arquitectura y principios
- **.claude/**: Comandos y agentes especializados
- **Context Engineering**: Estructura diseñada para navegación IA

---

## 🚢 Deployment

### Vercel (Recomendado)

1. **Conecta tu repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Import Project → Selecciona tu repo

2. **Configura variables de entorno**
   - Agrega las mismas variables de `.env.local`

3. **Deploy!**
   - Vercel detectará Next.js automáticamente
   - Build y deploy en ~2 minutos

### Otras plataformas

Compatible con:
- Netlify
- Railway
- Render
- AWS Amplify

---

## 🤝 Contribución

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: formato, punto y coma faltante, etc
refactor: refactorización de código
test: agregar tests
chore: mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [OpenRouter](https://openrouter.ai/) - API unificada de IA
- [Tailwind CSS](https://tailwindcss.com/) - Utilidades CSS
- [Chart.js](https://www.chartjs.org/) - Gráficas

---

## 📧 Contacto

**Desarrollador**: Daniel Carreon
**Repositorio**: [github.com/daniel-carreon/sistema-financiero-app](https://github.com/daniel-carreon/sistema-financiero-app)

---

**¿Necesitas ayuda?** Abre un [Issue](https://github.com/daniel-carreon/sistema-financiero-app/issues) en GitHub.

---

<div align="center">

**Desarrollado con ❤️ usando [Claude Code](https://claude.com/claude-code)**

</div>
