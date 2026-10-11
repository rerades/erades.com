# Area 73 blog

A bilingual (es/en) technical blog. This glossary fixes the words for what gets
written, classified and published.

## Language

### Publishing

**Article**:
One piece of writing, in both languages. It is the unit that gets written, published and announced.
_Avoid_: Post (for the pair), entry

**Version**:
An article in one language, with its own path and URL. The two versions of an article are paired by a shared translation key, never by path.
_Avoid_: Translation, post (acceptable only in code, where "post" means a version)

**Draft**:
An article that is not published yet. It is a state of the whole article: both versions go out together or neither does.
_Avoid_: Unpublished version

**Path**:
Where a version lives, and therefore its URL (`es/funcional/funtores`). Each language names its own. The folder segments are only part of the URL and carry no classification.
_Avoid_: Using the folder as a category

### Classification

**Tag**:
A language-neutral label: lowercase, kebab-case, in English, and identical on both versions of an article. Its visible name may be localised.
_Avoid_: Keyword, translated tag values

**Category**:
What an article is about, chosen from a short closed list (`javascript`, `css`, `functional`, `ai`, `design-patterns`, `wpo`, `experiments`). An article can have several; the value is a language-neutral identifier (`design-patterns`) whose visible name is localised.
_Avoid_: Topic, section, using a tag as a category

**Primary category**:
The first category of an article: the one shown when only one fits.
_Avoid_: Main tag

**Series**:
A reading path the author declares: articles to be read in an explicit order the author sets. Being a series is an editorial decision, not something deduced from sharing a topic or from publication dates. Independent of category. An article belongs to at most one series, and a draft is not part of any series until it is published.
_Avoid_: Collection, group, ordering by date
