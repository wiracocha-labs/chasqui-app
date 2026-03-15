# Despliegue de Chasqui App en Cloudflare Pages (desde Dashboard)

## 🚀 Configuración para Despliegue Web

Como usas **pnpm**, aquí está la configuración específica para desplegar desde el dashboard de Cloudflare.

## 📋 Prerrequisitos

1. **Cuenta de Cloudflare**: [dashboard.cloudflare.com](https://dash.cloudflare.com/)
2. **Repositorio en GitHub**: Tu código debe estar en GitHub
3. **pnpm-lock.yaml**: Ya existe en tu proyecto ✅

## 🔧 Configuración en Cloudflare Pages

### 1. Crear Proyecto

1. Ve a **Pages** → **Create a project**
2. Conecta tu cuenta de **GitHub**
3. Selecciona el repositorio `chasqui-app`

### 2. Configurar Build Settings

En la configuración del proyecto, establece:

```
Framework preset: Vite
Build command: pnpm install && pnpm run build
Build output directory: frontend/dist
Root directory: / (dejar vacío o usar .)
```

### 3. Variables de Entorno

Ve a **Settings** → **Environment variables** y añade:

```
VITE_PROXY_TARGET=https://tu-backend-url.com
VITE_AVALANCHE_NETWORK_ID=43114
VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
VITE_CONTRACT_ADDRESS=tu_contrato_address
VITE_APP_NAME=Chasqui App
VITE_APP_VERSION=1.0.0
```

### 4. Node.js Version

Cloudflare Pages automáticamente usará la versión especificada en:
- `package.json` engines field (Node 18+, pnpm 8+)

## ⚙️ Configuración Adicional

### Para Web3/Blockchain

Asegúrate de tener configurado:

```bash
# En frontend/.env
VITE_AVALANCHE_NETWORK_ID=43114  # o 43113 para Fuji testnet
VITE_AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
VITE_CONTRACT_ADDRESS=0x...  # tu contrato desplegado
```

### Para Backend Integration

```bash
# URL de tu backend Rust
VITE_PROXY_TARGET=https://tu-chasqui-server.com
```

## 🌐 Despliegue Automático (CI/CD)

Con la configuración anterior, cada vez que hagas push a tu rama principal:

1. Cloudflare detectará los cambios
2. Ejecutará `pnpm install && pnpm run build`
3. Desplegará automáticamente

## 🔍 Troubleshooting

### Build Fails

1. **Verifica pnpm version**: Cloudflare usa la última versión por defecto
2. **Node version**: El `engines` field en package.json asegura Node 18+
3. **Dependencies**: Asegúrate que `pnpm-lock.yaml` esté actualizado

### Environment Variables

1. Las variables deben empezar con `VITE_` para que Vite las exponga
2. Verifica que no haya espacios en blanco
3. Los cambios en variables requieren nuevo deployment

### Web3 Issues

1. **CORS**: Configura tu backend para permitir tu dominio Cloudflare
2. **RPC URLs**: Usa URLs públicas de Avalanche o servicios como Alchemy
3. **Contract Address**: Verifica que sea la dirección correcta en la red correspondiente

## 📊 Monitoreo

En el dashboard de Cloudflare Pages puedes:

- Ver **build logs**
- Monitorizar **analytics**
- Configurar **custom domains**
- Establecer **branch deployments**

## 🎯 Flujo de Trabajo Recomendado

1. **Development**: Trabaja localmente con `pnpm dev`
2. **Testing**: `pnpm run build` localmente antes de commits
3. **Deployment**: Push a GitHub → Despliegue automático
4. **Preview**: Usa feature branches para previews automáticos

## 🚀 Comandos Locales Útiles

```bash
# Instalar dependencias
pnpm install

# Build local para testing
pnpm run build

# Preview del build
pnpm run preview

# Linting
pnpm run lint
```

## 📝 Notas Importantes

- **pnpm**: Cloudflare Pages soporta pnpm nativamente
- **Node 18+**: Requerido por engines field en package.json
- **SPA**: Las rutas son manejadas automáticamente por Vite
- **Assets**: Los archivos estáticos se sirven desde el CDN de Cloudflare

## 🆘 Soporte

- **Cloudflare Docs**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/)
- **pnpm Issues**: [github.com/pnpm/pnpm](https://github.com/pnpm/pnpm)
- **Project Issues**: Repositorio de Chasqui App
