import Icon from "./Icon";

/** Busca apenas visual: não envia nada. */
export default function SearchForm({ placeholder = "Pesquisar …" }: { placeholder?: string }) {
  return (
    <div className="search-form" role="search">
      <input
        type="search"
        className="search-field"
        placeholder={placeholder}
        aria-label="Pesquisar por"
      />
      <button type="button" className="search-submit" aria-label="Pesquisar">
        <Icon name="search" />
      </button>
    </div>
  );
}
