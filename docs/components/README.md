# Componentes

> Generado por `pnpm docs:components`. No editar a mano.

La descripción y el uso salen del JSDoc de cada componente; la tabla de
props y los slots se leen del `interface Props` y del markup, así que no
envejecen. Verlos en marcha: `pnpm dev` y `/es/dev/componentes`.

## Primitivos (`ui/`)

Copiados del registry de bejamas/ui. Son los únicos con JS de cliente. El
*cómo* se copian y se podan está en [`../bejamas-ui.md`](../bejamas-ui.md);
su coste medido, en [`../bejamas-ui-presupuesto.md`](../bejamas-ui-presupuesto.md).

| Componente | Descripción | Props |
| --- | --- | --- |
| [Dialog](./dialog.md) | An accessible modal window for focused content or user actions with customizable open/close behavior. | 5 |
| [Dropdown Menu](./dropdown-menu.md) | Action and selection menus with runtime-owned open, highlight, and committed selection state. | 9 |
| [Native Select](./native-select.md) | A styled native HTML select element with consistent design system integration. | 2 |
| [Separator](./separator.md) | Visual separator for grouping content, supporting horizontal and vertical orientation. | 0 |

## Componentes del sitio

| Componente | Descripción | Props |
| --- | --- | --- |
| [Base Head](./base-head.md) | Todo lo que va en el <head> de cualquier página: metadatos globales, canónica, Open Graph, Twitter Card, los tres feeds RSS y Google Analytics. | 3 |
| [Blog Card](./blog-card.md) | Despacha a la tarjeta de rejilla o a la de lista según `variant`. Existe para que quien pinta un listado no tenga que saber cuál de las dos toca. | 4 |
| [Blog Card (rejilla)](./blog-card-grid.md) | La tarjeta de un post en modo rejilla: imagen destacada, título, fecha y descripción. `index` decide la carga de la imagen: las primeras van eager. | 3 |
| [Blog Card (lista)](./blog-card-list.md) | La tarjeta de un post en modo lista: la misma información que en rejilla pero en horizontal, con la imagen a un lado. | 3 |
| [Blog Filters](./blog-filters.md) | Filtro por categoría, orden y modo de vista. Es un formulario GET: el estado vive en la URL, no en JavaScript, y por eso el listado es enlazable y sobrevive a una recarga. El orden usa el `NativeSelect` de bejamas/ui, que se envía solo con `onchange`. | 8 |
| [Blog List](./blog-list.md) | Orquesta un listado completo: filtros, tarjetas, paginador, contador de resultados y estado vacío. Las páginas de blog, tags y búsqueda son todas este componente con props distintas. Recibe `posts` (el total, para contar) y `paginatedPosts` (lo que pinta) por separado. | 17 |
| [Else](./else.md) | La rama falsa de un `If`. No decide nada: solo envuelve el contenido para que `If` lo reciba como el slot `else`. | 0 |
| [Footer](./footer.md) | Pie del sitio: copyright con el año actual y los enlaces sociales. | 1 |
| [Formatted Date](./formatted-date.md) | Una fecha en un `<time datetime>`, formateada según el idioma. El atributo `datetime` lleva siempre la fecha ISO, que es lo que leen los buscadores y los lectores de pantalla. | 2 |
| [Google Analytics](./google-analytics.md) | Carga GA4 solo si `PUBLIC_GA_MEASUREMENT_ID` está configurada: sin variable no emite ni una etiqueta. Va con `async` y `fetchpriority="low"` para no competir con el render, y con la IP anonimizada y las señales publicitarias desactivadas. El condicional es un `ShowWhen` y no una expresión JSX envolvente por un motivo que está comentado en el fichero: dentro de una expresión, Astro emite el cuerpo del script literal en vez de evaluarlo. | 0 |
| [Header](./header.md) | La cabecera del sitio: logo, navegación, buscador, cambio de idioma, tema, menú de perfil y el menú móvil, que es un `Dialog` de bejamas/ui. Aquí vive también el único listener delegado que atiende a todos los `[data-lang-switch]` del documento, haya uno o varios. | 1 |
| [Header Link](./header-link.md) | Un enlace de la navegación. Hace tres cosas que un `<a>` pelado no hace: le antepone el idioma al `href` si falta, se marca como activo (`aria-current="page"`) comparando con la ruta actual, y le pone el icono que corresponda a esa sección. Acepta cualquier atributo de `<a>`; los que no reconoce se reenvían tal cual. | 0 |
| [Header Search Box](./header-search-box.md) | El `SearchInput` envuelto en el formulario que lo envía a `/{lang}/search`. Separado del input porque este último también se usa dentro de la propia página de búsqueda, donde el formulario ya existe. | 0 |
| [Icon Wrapper](./icon-wrapper.md) | Pinta un icono de `@lucide/astro` solo si se le pasa uno. Evita el `{Icon && <Icon />}` repetido en cada sitio donde el icono es opcional. | 2 |
| [If](./if.md) | Condicional con dos ramas. Usa slots con nombre (`Astro.slots.has()`) en vez de inspeccionar los hijos, así que la rama que no se cumple no llega a renderizarse. Es la alternativa del repo al ternario incrustado en el markup. Para una sola rama, `ShowWhen`. | 1 |
| [Language Switch](./language-switch.md) | Botones ES/EN. Existe porque este markup se renderiza dos veces —una en la barra de escritorio y otra dentro del menú móvil— y estaba duplicado a mano: de ahí salieron los ids `lang-es`/`lang-en` repetidos que dejaban muertos los botones del móvil. Con un solo origen, ese fallo no puede volver por copia. El comportamiento no vive aquí: un único listener delegado en Header.astro atiende a todos los `[data-lang-switch]` del documento, haya los que haya. | 2 |
| [LinkedIn Icon](./linkedin-icon.md) | El logotipo de LinkedIn como SVG en línea. Existe porque `@lucide/astro` no trae marcas comerciales. | 1 |
| [No Results](./no-results.md) | El estado vacío de un listado: un mensaje y, si se le da `onResetHref`, un enlace para quitar los filtros. | 2 |
| [Paginator](./paginator.md) | Paginación con anterior, siguiente y números. Navega con enlaces reales, no con JavaScript: cada página tiene su URL y se puede compartir. Con `disableInactive` los extremos se pintan apagados en vez de desaparecer, para que la barra no cambie de ancho al llegar al final. | 9 |
| [Results Info](./results-info.md) | El «mostrando N de M» de un listado, con la consulta si la hubo. No se pinta cuando no hay nada que contar. | 4 |
| [Search Input](./search-input.md) | El campo de busqueda, con su etiqueta accesible y el valor actual de la consulta. No busca nada por sí mismo: quien lo envuelve decide a dónde va el formulario. | 2 |
| [Show When](./show-when.md) | Renderiza su contenido solo si la condicion se cumple. Trata el array vacío como falso, que es el caso que más veces se escapa con un `&&` a pelo. Para dos ramas, `If` con `Then` y `Else`. | 1 |
| [Social Profile Menu](./social-profile-menu.md) | El menú del avatar: nombre, correo y enlaces sociales dentro de un `DropdownMenu` de bejamas/ui. El botón del avatar vive aquí y no en `Header.astro` porque el disparador y el contenido tienen que colgar de la misma raíz `data-slot="dropdown-menu"`. | 6 |
| [Theme Toggle](./theme-toggle.md) | El interruptor de tema claro/oscuro. La preferencia se guarda en `localStorage` y se aplica antes de pintar, para que no haya un fogonazo blanco al cargar en oscuro. | 0 |
| [Then](./then.md) | La rama verdadera de un `If`. No decide nada: solo envuelve el contenido para que `If` lo reciba como el slot `then`. | 0 |
| [View Mode Toggle](./view-mode-toggle.md) | Cambia el listado entre rejilla y lista. Son dos enlaces, no dos botones: el modo viaja en la URL como un filtro más. | 2 |
| [View Transitions](./view-transitions.md) | El pegamento de las transiciones entre páginas: marca el título de la tarjeta que se acaba de pulsar para que vuele hasta el título del post. No renderiza nada; las animaciones en sí viven en `global.css`. Va en el `<head>`, dentro de `BaseHead`. | 0 |
