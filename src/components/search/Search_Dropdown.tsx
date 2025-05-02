import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { pages } from './SearchData';
import { Search } from 'lucide-react';

// Creamos una instancia de Fuse con las páginas y sus palabras clave
const fuse = new Fuse(pages, {
  keys: ['nombre', 'keywords'],
  threshold: 0.4,
});

export default function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof pages>([]);

  useEffect(() => {
    if (query.length < 2) return setResults([]);

    const matches = fuse.search(query);
    setResults(matches.map((m) => m.item));
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-black border border-gray-300 focus:outline-none"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-3 text-gray-600" />
      {results.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded shadow z-50 w-full max-h-60 overflow-y-auto text-black">
          {results.map((res) => (
            <li key={res.url}>
              <a href={res.url} className="block px-4 py-2 hover:bg-gray-200">
                {res.nombre}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
