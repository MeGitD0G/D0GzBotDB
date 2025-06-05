import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button'; 
import { PokemonBasicInfo } from '../../types';
import { POKEMON_TYPES } from '../../constants'; 
import { Search, AlertTriangle, XCircle, Filter, Loader2 } from 'lucide-react';

interface Generation {
  name: string;
  url: string;
  id: number; 
}

const PokedexPage: React.FC = () => {
  const [allPokemonMasterList, setAllPokemonMasterList] = useState<PokemonBasicInfo[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonBasicInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalToLoad, setTotalToLoad] = useState(0);

  const [generationsList, setGenerationsList] = useState<Generation[]>([]);
  const [selectedGenerationUrl, setSelectedGenerationUrl] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const fetchInChunks = async (items: {name: string, url: string}[], chunkSize: number, delay: number): Promise<PokemonBasicInfo[]> => {
    const results: PokemonBasicInfo[] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (p: { name: string, url: string }) => {
        try {
          const detailResponse = await fetch(p.url);
          if (!detailResponse.ok) {
             console.warn(`Failed to fetch details for ${p.name}, status: ${detailResponse.status}`);
             return null;
          }
          const detailData = await detailResponse.json();
          return {
            id: detailData.id,
            name: detailData.name.charAt(0).toUpperCase() + detailData.name.slice(1),
            spriteUrl: detailData.sprites.front_default || `https://via.placeholder.com/96?text=${detailData.name.charAt(0).toUpperCase()}`,
            types: detailData.types.map((typeInfo: any) => typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)),
          };
        } catch (individualError: any) {
          console.warn(`Error fetching details for ${p.name}: ${individualError.message}`);
          return null;
        }
      });
      
      const chunkResults = (await Promise.all(chunkPromises)).filter(p => p !== null) as PokemonBasicInfo[];
      results.push(...chunkResults);
      setLoadingProgress(prev => prev + chunk.length);
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before next chunk
    }
    return results;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      setAllPokemonMasterList([]);
      setFilteredPokemon([]);
      setLoadingProgress(0);
      setTotalToLoad(0);

      try {
        const genListResponse = await fetch('https://pokeapi.co/api/v2/generation');
        if (!genListResponse.ok) throw new Error('Failed to fetch generations list.');
        const genListData = await genListResponse.json();
        const generations = genListData.results.map((gen: { name: string, url: string }) => {
          const urlParts = gen.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2], 10);
          return { ...gen, id, name: gen.name.replace('generation-', 'Generation ').toUpperCase() };
        });
        setGenerationsList(generations);

        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        if (!countResponse.ok) throw new Error(`HTTP error! status: ${countResponse.status} (fetching count)`);
        const countData = await countResponse.json();
        const totalPokemonCount = countData.count;
        setTotalToLoad(totalPokemonCount);

        if (!totalPokemonCount || totalPokemonCount === 0) {
          throw new Error("Could not retrieve total Pokémon count from API.");
        }
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemonCount}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} (fetching all Pokémon names/URLs)`);
        const data = await response.json();
        
        const pokemonResources: {name: string, url: string}[] = data.results;
        const pokemonDetails = await fetchInChunks(pokemonResources, 50, 100); // Fetch 50 at a time, 100ms delay

        setAllPokemonMasterList(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
      } catch (e: any) {
        setError(`Failed to load Pokedex data: ${e.message}. Please ensure you have internet connectivity.`);
        console.error(e);
        setAllPokemonMasterList([]); 
        setFilteredPokemon([]);
      } finally {
        setIsLoading(false);
        setLoadingProgress(0); // Reset progress after loading or error
        setTotalToLoad(0);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      if (isLoading) return; 
      
      setIsFiltering(true);
      // setError(null); // Keep previous errors unless a new filter action clears them
      let currentList = [...allPokemonMasterList];

      if (selectedGenerationUrl && selectedGenerationUrl !== "all") {
        try {
          const genResponse = await fetch(selectedGenerationUrl);
          if (!genResponse.ok) throw new Error(`Failed to fetch data for ${generationsList.find(g => g.url === selectedGenerationUrl)?.name || 'selected generation'}.`);
          const genData = await genResponse.json();
          const genPokemonNames = genData.pokemon_species.map((s: any) => s.name);
          currentList = allPokemonMasterList.filter(p => genPokemonNames.includes(p.name.toLowerCase()));
        } catch (err: any) {
          console.error("Error filtering by generation:", err);
          setError(`Could not apply generation filter: ${err.message}`);
          // Potentially revert to allPokemonMasterList or keep currentList as is before this failing filter
        }
      }

      if (selectedTypes.length > 0) {
        currentList = currentList.filter(p =>
          selectedTypes.some(st => p.types.map(t => t.toLowerCase()).includes(st.toLowerCase()))
        );
      }

      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      if (lowerSearchTerm) {
        currentList = currentList.filter(p =>
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          p.id.toString().includes(lowerSearchTerm) ||
          p.types.some(t => t.toLowerCase().includes(lowerSearchTerm))
        );
      }

      setFilteredPokemon(currentList);
      setIsFiltering(false);
    };

    if (allPokemonMasterList.length > 0) {
      applyFilters();
    } else if (!isLoading) { 
      setFilteredPokemon([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, allPokemonMasterList, selectedGenerationUrl, selectedTypes, isLoading /* generationsList removed as it only changes on init */]);


  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedGenerationUrl("all");
    setSelectedTypes([]);
    setSearchTerm(""); 
  };
  
  const generationOptions = [{ value: "all", label: "All Generations" }, ...generationsList.map(gen => ({ value: gen.url, label: gen.name }))];

  const getTypeBgColor = (type: string) => {
    const colors: {[key: string]: string} = {
      Normal: 'bg-gray-400 dark:bg-gray-500', Fire: 'bg-red-500 dark:bg-red-600', Water: 'bg-blue-500 dark:bg-blue-600', Grass: 'bg-green-500 dark:bg-green-600',
      Electric: 'bg-yellow-400 dark:bg-yellow-500', Ice: 'bg-cyan-400 dark:bg-cyan-500', Fighting: 'bg-orange-600 dark:bg-orange-700', Poison: 'bg-purple-500 dark:bg-purple-600',
      Ground: 'bg-yellow-600 dark:bg-yellow-700', Flying: 'bg-indigo-400 dark:bg-indigo-500', Psychic: 'bg-pink-500 dark:bg-pink-600', Bug: 'bg-lime-500 dark:bg-lime-600',
      Rock: 'bg-yellow-700 dark:bg-amber-800', Ghost: 'bg-indigo-600 dark:bg-indigo-700', Dragon: 'bg-indigo-500 dark:bg-purple-700', Dark: 'bg-neutral-700 dark:bg-neutral-800',
      Steel: 'bg-gray-500 dark:bg-gray-600', Fairy: 'bg-pink-400 dark:bg-pink-500',
    };
    return colors[type] || 'bg-gray-300 dark:bg-gray-400';
  };

  return (
    <Card title="Pokédex">
      <p className="text-neutral-600 dark:text-neutral-400 mb-4">
        Browse Pokémon information. Data fetched from PokéAPI. Use filters to narrow your search. Click on a Pokémon to see more details.
      </p>

      <div className="mb-6 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <Select
            label="Filter by Generation"
            options={generationOptions}
            value={selectedGenerationUrl}
            onChange={(e) => setSelectedGenerationUrl(e.target.value)}
            containerClassName="mb-0"
            disabled={isLoading || isFiltering}
          />
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Filter by Type(s)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded-md max-h-40 overflow-y-auto bg-white dark:bg-neutral-700 dark:border-neutral-600">
              {POKEMON_TYPES.map(type => (
                <label key={type} className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3.5 w-3.5 text-primary-600 rounded border-neutral-300 dark:border-neutral-500 focus:ring-primary-500"
                    checked={selectedTypes.includes(type.toLowerCase())}
                    onChange={() => handleTypeChange(type.toLowerCase())}
                    disabled={isLoading || isFiltering}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
           <div className="flex items-end h-full">
            <Button 
                onClick={clearFilters} 
                variant="outline" 
                size="md" 
                leftIcon={<XCircle size={16}/>} 
                disabled={isLoading || isFiltering}
                className="w-full"
            >
                Clear All Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-6 relative">
        <Input
            type="text"
            placeholder="Search by name, ID, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            inputClassName="pl-10"
            id="pokedex-search"
            aria-label="Search Pokedex"
            disabled={isLoading || isFiltering}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary-500" />
          <p className="ml-0 mt-4 text-neutral-600 dark:text-neutral-400">
            Loading Pokémon... {totalToLoad > 0 && `(${loadingProgress} / ${totalToLoad})`}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">(This may take a moment for the initial load of all Pokémon)</p>
        </div>
      )}
      {isFiltering && !isLoading && (
         <div className="flex flex-col justify-center items-center h-64 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary-500" />
          <p className="ml-0 mt-4 text-neutral-600 dark:text-neutral-400">Applying filters...</p>
        </div>
      )}


      {error && (
        <div className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-md relative mb-4" role="alert">
          <div className="flex">
            <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-300 mr-3" /></div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isFiltering && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPokemon.length > 0 ? filteredPokemon.map(pokemon => (
            <Link key={pokemon.id} to={`/pokemon/pokedex/${pokemon.name.toLowerCase()}`} className="group block" aria-label={`View details for ${pokemon.name}`}>
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center group-hover:shadow-xl group-hover:border-primary-500 dark:group-hover:border-primary-400 dark:hover:shadow-primary-500/20 transition-all duration-200 bg-white dark:bg-neutral-800 h-full">
                <img 
                  src={pokemon.spriteUrl} 
                  alt={pokemon.name} 
                  className="w-24 h-24 object-contain mb-2 bg-neutral-100 dark:bg-neutral-700 rounded-md group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = `https://via.placeholder.com/96?text=${pokemon.name.charAt(0).toUpperCase()}`)}
                />
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">#{pokemon.id} {pokemon.name}</h3>
                <div className="flex space-x-1 mt-1">
                  {pokemon.types.map(type => (
                    <span key={type} className={`px-2 py-0.5 text-xs text-white rounded-full shadow-sm ${getTypeBgColor(type)}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )) : (
            <p className="col-span-full text-center text-neutral-500 dark:text-neutral-400 py-8">No Pokémon found matching your criteria. Try adjusting filters or search term.</p>
          )}
        </div>
      )}
       {!isLoading && !isFiltering && !error && (
         <p className="mt-6 text-sm text-center text-neutral-500 dark:text-neutral-400">
           Displaying {filteredPokemon.length} Pokémon. (Master list contains {allPokemonMasterList.length} Pokémon)
         </p>
       )}
    </Card>
  );
};

export default PokedexPage;