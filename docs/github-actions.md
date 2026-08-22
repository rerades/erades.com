# Pipeline de CI/CD

Este directorio contiene la configuración de GitHub Actions del proyecto erades.com.

## Workflows

### 1. CI (`ci.yml`)

El workflow principal, que corre en cada push y pull request:

- **Lint**: verifica el código con ESLint (timeout: 10 min)
- **Unit Tests**: ejecuta los tests unitarios con Vitest y coverage (timeout: 15 min)
- **E2E Tests**: ejecuta los tests end-to-end con Playwright en contenedor (timeout: 30 min)
- **Visual Tests**: ejecuta los tests de regresión visual en contenedor (timeout: 20 min)
- **Build**: construye la aplicación (timeout: 15 min)

**Características:**

- Concurrencia para cancelar automáticamente las ejecuciones anteriores
- Caché local de buildx para optimizar la construcción de la imagen Docker
- Estrategia de «todo dentro del contenedor» para los tests E2E y visuales

### 2. Update Visual Snapshots (`update-snapshots.yml`)

Workflow manual para actualizar los snapshots de regresión visual:

- Se puede lanzar a mano desde GitHub Actions
- Permite elegir entre el entorno «enhanced» o «basic»
- Crea automáticamente un PR con los snapshots actualizados
- Usa la misma caché local de buildx que el CI principal (timeout: 30 min)

### 3. Security (`security.yml`)

Escaneo de seguridad y dependencias:

- Ejecuta `pnpm audit` semanalmente
- Revisión de dependencias en los PRs
- Escaneo automático de vulnerabilidades

### 4. Auto Merge (`automerge.yml`)

Workflow automático para mergear PRs:

- Se dispara al añadir la etiqueta «automerge»
- Espera a que pasen todos los checks antes de mergear
- Usa squash merge como método por defecto

### 5. Label Auto Merge (`label-automerge.yml`)

Workflow que etiqueta automáticamente PRs para auto-merge:

- Se dispara cuando el CI pasa
- Añade la etiqueta «automerge» a los PRs que apuntan a master

## Configuración

### Secrets necesarios

Para el despliegue hay que configurar estos secrets en el repositorio:

- `DEPLOY_KEY`: clave SSH del servidor
- `DEPLOY_HOST`: hostname del servidor
- `DEPLOY_PATH`: ruta en el servidor
- `SNYK_TOKEN`: token de Snyk (opcional)
- `CODECOV_TOKEN`: token de Codecov para coverage (opcional)

### Configuración de ramas

El proyecto usa `master` como rama principal. Todos los workflows están configurados para:

- Correr en pushes a `master`
- Correr en pull requests que apuntan a `master`
- Desplegar automáticamente sólo desde `master`

### Configuración de Dependabot

El fichero `dependabot.yml` está configurado para:

- Actualizar dependencias npm semanalmente
- Actualizar GitHub Actions semanalmente
- Ignorar actualizaciones major de paquetes críticos
- Asignar automáticamente los PRs a @rerades

## Estrategia de contenedores

### Jobs de Node vs jobs de Docker

**Jobs de Node** (lint, test, build):

- Usan la caché de pnpm en el host
- Instalan las dependencias en local
- Corren en el runner de GitHub

**Jobs de Docker** (E2E, Visual):

- Construyen la imagen `erades-com-e2e` con caché local de buildx
- Ejecutan los tests dentro del contenedor
- Usan volúmenes con nombre para persistir datos

### Caché optimizada

- **Caché de pnpm**: para los jobs de Node (lint, test, build)
- **Caché local de buildx**: para construir la imagen Docker en `/tmp/.buildx-cache`
- **Volúmenes Docker**: para browsers, node_modules y el store de pnpm

## Artefactos

Los workflows generan estos artefactos:

- `playwright-report`: informes HTML de los tests E2E
- `visual-test-results`: resultados de los tests de regresión visual
- `build-output`: build de la aplicación

## Resolución de problemas

### Fallan los tests visuales

Si fallan los tests de regresión visual:

1. Lanza a mano el workflow «Update Visual Snapshots»
2. Revisa los cambios en el PR generado
3. Acepta los cambios si son correctos

### Fallan los tests E2E

Si fallan los tests E2E:

1. Comprueba que la aplicación construye correctamente
2. Revisa los logs del contenedor Docker
3. Confirma que webServer está configurado con `--host 0.0.0.0`

### Falla el build

Si falla el build:

1. Comprueba que están instaladas todas las dependencias
2. Revisa los logs de lint
3. Asegúrate de que TypeScript compila correctamente

### La caché de buildx no funciona

Si la caché de buildx no funciona:

1. Comprueba que el directorio `/tmp/.buildx-cache` tiene permisos de escritura
2. Confirma que el runner tiene espacio en disco suficiente
3. Revisa los logs del build de Docker

### Timeouts

Si los jobs fallan por timeout:

- **Lint**: 10 minutos (suele bastar)
- **Unit Tests**: 15 minutos (incluye coverage)
- **Visual Tests**: 20 minutos (build + tests)
- **E2E Tests**: 30 minutos (build + tests)
- **Build**: 15 minutos (build de la aplicación)
- **Update Snapshots**: 30 minutos (build + tests + PR)

## Optimizaciones aplicadas

- **Concurrencia**: evita colas infinitas cancelando las ejecuciones anteriores
- **Caché local de buildx**: reduce el tiempo de construcción de la imagen Docker
- **Timeouts**: evita jobs zombie y un uso excesivo de recursos
- **Volúmenes con nombre**: consistencia entre local y CI
- **Estrategia unificada**: todo dentro del contenedor para los tests E2E/visuales
