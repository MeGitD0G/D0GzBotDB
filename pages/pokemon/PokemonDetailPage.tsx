
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { POKEAPI_BASE_URL, LATEST_RELEVANT_GAME_VERSION } from '../../constants';
import { PokemonDetailed, PokemonSpecies, EvolutionChain, MoveDetail, FormattedMove, VersionGroupDetail, AbilityInfo, EvolutionChainLink } from '../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ArrowLeft, AlertTriangle, Loader2, Zap, ChevronsRight, Sparkles, Info, ChevronDown, ChevronUp, Swords, Shield, TrendingUp, BookOpen, Share2 } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';

const getTypeClass = (type: string, prefix: string = 'bg') => {
    const typeLower = type.toLowerCase();
    const colors: {[key: string]: string} = {
      normal: `${prefix}-gray-400 dark:${prefix}-gray-500`, fire: `${prefix}-red-500 dark:${prefix}-red-600`, water: `${prefix}-blue-500 dark:${prefix}-blue-600`, grass: `${prefix}-green-500 dark:${prefix}-green-600`,
      electric: `${prefix}-yellow-400 dark:${prefix}-yellow-500`, ice: `${prefix}-cyan-400 dark:${prefix}-cyan-500`, fighting: `${prefix}-orange-600 dark:${prefix}-orange-700`, poison: `${prefix}-purple-500 dark:${prefix}-purple-600`,
      ground: `${prefix}-yellow-600 dark:${prefix}-yellow-700`, flying: `${prefix}-indigo-400 dark:${prefix}-indigo-500`, psychic: `${prefix}-pink-500 dark:${prefix}-pink-600`, bug: `${prefix}-lime-500 dark:${prefix}-lime-600`,
      rock: `${prefix}-yellow-700 dark:${prefix}-amber-800`, ghost: `${prefix}-indigo-600 dark:${prefix}-indigo-700`, dragon: `${prefix}-indigo-500 dark:${prefix}-purple-700`, dark: `${prefix}-neutral-700 dark:${prefix}-neutral-800`,
      steel: `${prefix}-gray-500 dark:${prefix}-gray-600`, fairy: `${prefix}-pink-400 dark:${prefix}-pink-500`,
    };
    return colors[typeLower] || `${prefix}-gray-300 dark:${prefix}-gray-400`;
  };

const getShowdownSpriteUrl = (pokemonName: string, isShiny: boolean = false): string => {
    const baseName = pokemonName.toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
    const shinyPrefix = isShiny ? "shinyani/" : "ani/";
    return `https://play.pokemonshowdown.com/sprites/${shinyPrefix}${baseName}.gif`;
}

const PokemonDetailPage: React.FC = () => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const navigate = useNavigate();

  const [pokemonData, setPokemonData] = useState<PokemonDetailed | null>(null);
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [evolutionChainData, setEvolutionChainData] = useState<EvolutionChain | null>(null);
  const [selectedMove, setSelectedMove] = useState<MoveDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [spriteEffect, setSpriteEffect] = useState<{active: boolean, color: string}>({active: false, color: 'transparent'});
  const [evolutionSprites, setEvolutionSprites] = useState<Record<string, string>>({});
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!pokemonName) {
        setError("Pokémon name not provided.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      setPokemonData(null);
      setSpeciesData(null);
      setEvolutionChainData(null);
      setEvolutionSprites({});
      setShowShiny(false);

      try {
        const pokemonRes = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonName.toLowerCase()}`);
        if (!pokemonRes.ok) throw new Error(`Could not fetch Pokémon data for "${pokemonName}". Status: ${pokemonRes.status}`);
        const fetchedPokemonData: PokemonDetailed = await pokemonRes.json();
        setPokemonData(fetchedPokemonData);

        if (fetchedPokemonData.species.url) {
          const speciesRes = await fetch(fetchedPokemonData.species.url);
          if (!speciesRes.ok) throw new Error(`Could not fetch species data. Status: ${speciesRes.status}`);
          const fetchedSpeciesData: PokemonSpecies = await speciesRes.json();
          setSpeciesData(fetchedSpeciesData);

          if (fetchedSpeciesData.evolution_chain?.url) {
            const evolutionRes = await fetch(fetchedSpeciesData.evolution_chain.url);
            if (!evolutionRes.ok) throw new Error(`Could not fetch evolution data. Status: ${evolutionRes.status}`);
            const fetchedEvolutionData = await evolutionRes.json();
            setEvolutionChainData(fetchedEvolutionData);
            if(fetchedEvolutionData?.chain) await loadSpritesForEvolutionChain(fetchedEvolutionData.chain);
          }
        }
      } catch (e: any) {
        console.error("Error fetching Pokémon details:", e);
        setError(e.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonName]);

  const loadSpritesForEvolutionChain = async (chain: EvolutionChainLink | undefined) => {
    if (!chain) return;
    const spritesToLoad: Record<string, string> = {};
    const queue: EvolutionChainLink[] = [chain];
    const visited = new Set<string>();

    while(queue.length > 0) {
        const stage = queue.shift();
        if(stage && !visited.has(stage.species.name)) {
            visited.add(stage.species.name);
            spritesToLoad[stage.species.name] = getShowdownSpriteUrl(stage.species.name, false);
            stage.evolves_to.forEach(nextStage => queue.push(nextStage));
        }
    }
    setEvolutionSprites(prev => ({...prev, ...spritesToLoad}));
  };


  const handleMoveClick = async (moveUrl: string, moveDisplayName: string) => {
    setIsLoading(true); // Indicate loading for move details specifically
    try {
      const moveRes = await fetch(moveUrl);
      if (!moveRes.ok) throw new Error("Could not fetch move details.");
      const moveDetails: MoveDetail = await moveRes.json();
      setSelectedMove(moveDetails);
      setIsMoveModalOpen(true);

      const moveTypeColors: Record<string, string> = {
          normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C',
          ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3',
          psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
          dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD',
      };
      const effectColor = moveTypeColors[moveDetails.type.name.toLowerCase()] || '#A8A77A';

      setSpriteEffect({active: true, color: effectColor });
      setTimeout(() => setSpriteEffect({active:false, color:'transparent'}), 700);

    } catch (e: any) {
      setError(e.message || "Failed to load move details.");
      // Ensure modal doesn't stay open if move fetch fails
      setIsMoveModalOpen(false); 
      setSelectedMove(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatStatName = (name: string): string => {
    const map: Record<string, string> = {
      'hp': 'HP', 'attack': 'Attack', 'defense': 'Defense',
      'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', 'speed': 'Speed'
    };
    return map[name.toLowerCase()] || name.split('-').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
  };

  const statsForChart = useMemo(() => {
    if (!pokemonData) return [];
    return pokemonData.stats.map(s => ({
      subject: formatStatName(s.stat.name),
      value: s.base_stat,
      fullMark: s.stat.name.toLowerCase().includes('hp') ? 255 : 200, // Max value for HP is higher
    }));
  }, [pokemonData]);

  const flavorTexts = useMemo(() => {
    if (!speciesData) return [];
    const englishEntries = speciesData.flavor_text_entries.filter(entry => entry.language.name === 'en');
    const uniqueEntries: { version: string; text: string }[] = [];
    const seenTexts = new Set<string>();

    const preferredEntry = englishEntries.find(entry => entry.version.name === LATEST_RELEVANT_GAME_VERSION);
    if (preferredEntry && !seenTexts.has(preferredEntry.flavor_text)) {
      uniqueEntries.push({ version: preferredEntry.version.name.replace(/-/g, ' '), text: preferredEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') });
      seenTexts.add(preferredEntry.flavor_text);
    }

    for (const entry of englishEntries.reverse()) { // Iterate reversed to get varied entries
      if (uniqueEntries.length >= 3) break; // Limit to 3 unique entries
      if (!seenTexts.has(entry.flavor_text)) {
        uniqueEntries.push({ version: entry.version.name.replace(/-/g, ' '), text: entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') });
        seenTexts.add(entry.flavor_text);
      }
    }
    return uniqueEntries;
  }, [speciesData]);

  const formattedMoves = useMemo(() => {
    if (!pokemonData) return { levelUp: [], machine: [], egg: [], tutor: [] };
    const moves: { levelUp: FormattedMove[], machine: FormattedMove[], egg: FormattedMove[], tutor: FormattedMove[] } = {
      levelUp: [], machine: [], egg: [], tutor: []
    };
    pokemonData.moves.forEach(moveEntry => {
      const versionDetail = moveEntry.version_group_details.find(
        (vgd: VersionGroupDetail) => vgd.version_group.name === LATEST_RELEVANT_GAME_VERSION
      ) || moveEntry.version_group_details.find(vgd => vgd.version_group.name === "ultra-sun-ultra-moon") || 
      moveEntry.version_group_details[moveEntry.version_group_details.length - 1];


      if (versionDetail) {
        const formatted: FormattedMove = {
          name: moveEntry.move.name.replace(/-/g, ' '),
          url: moveEntry.move.url,
          learnMethod: versionDetail.move_learn_method.name,
          levelLearnedAt: versionDetail.level_learned_at,
        };
        if (formatted.learnMethod === 'level-up') moves.levelUp.push(formatted);
        else if (formatted.learnMethod === 'machine') moves.machine.push(formatted);
        else if (formatted.learnMethod === 'egg') moves.egg.push(formatted);
        else if (formatted.learnMethod === 'tutor') moves.tutor.push(formatted);
      }
    });
    moves.levelUp.sort((a, b) => (a.levelLearnedAt || 0) - (b.levelLearnedAt || 0));
    moves.machine.sort((a,b) => a.name.localeCompare(b.name));
    moves.egg.sort((a,b) => a.name.localeCompare(b.name));
    moves.tutor.sort((a,b) => a.name.localeCompare(b.name));
    return moves;
  }, [pokemonData]);

  const parseEvolutionChain = (chainLink: EvolutionChainLink | undefined): JSX.Element[] => {
    if (!chainLink) return [];
    const elements: JSX.Element[] = [];
  
    function renderStage(stage: EvolutionChainLink, depth: number = 0, evolutionMethod?: string): JSX.Element {
      const speciesName = stage.species.name;
      const displayName = speciesName.charAt(0).toUpperCase() + speciesName.slice(1).replace(/-/g, ' ');
      const spriteUrl = evolutionSprites[speciesName] || getShowdownSpriteUrl(speciesName);
      const pokeApiFallbackSpriteBase = `${POKEAPI_BASE_URL}/pokemon/${speciesName.toLowerCase()}`;
  
      return (
        <div key={speciesName} className={`flex flex-col items-center p-2 ${depth > 0 ? 'ml-4 md:ml-8' : ''}`}>
          {evolutionMethod && (
            <div className="flex flex-col items-center mb-1 text-xs text-neutral-500 dark:text-neutral-400">
              <ChevronsRight size={18} className="text-primary-500" />
              <span className="text-center max-w-[100px]">{evolutionMethod}</span>
            </div>
          )}
          <Link to={`/pokemon/pokedex/${speciesName.toLowerCase()}`} className="flex flex-col items-center group">
            <img
              src={spriteUrl}
              alt={displayName}
              className="w-16 h-16 md:w-20 md:h-20 object-contain bg-neutral-100 dark:bg-neutral-700 rounded-md p-1 group-hover:shadow-lg transition-shadow"
              onError={async (e) => {
                const target = e.currentTarget;
                try {
                    const res = await fetch(pokeApiFallbackSpriteBase);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.sprites?.front_default) {
                            target.src = data.sprites.front_default;
                            return;
                        }
                    }
                } catch {}
                target.src = `https://via.placeholder.com/80?text=${displayName.charAt(0)}`;
              }}
            />
            <span className="mt-1 text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{displayName}</span>
          </Link>
          {stage.evolves_to.length > 0 && (
            <div className={`flex ${stage.evolves_to.length > 1 ? 'flex-col items-center md:flex-row md:items-start md:space-x-4' : 'flex-col items-center'} mt-2`}>
              {stage.evolves_to.map(nextStage => {
                const details = nextStage.evolution_details[0]; 
                let method = details?.trigger.name.replace(/-/g, ' ') || 'Unknown';
                if (details?.min_level) method += ` at Lv ${details.min_level}`;
                if (details?.item) method += ` with ${details.item.name.replace(/-/g, ' ')}`;
                if (details?.held_item) method += ` holding ${details.held_item.name.replace(/-/g, ' ')}`;
                if (details?.known_move) method += ` knowing ${details.known_move.name.replace(/-/g, ' ')}`;
                if (details?.time_of_day && details.time_of_day !== "") method += ` during ${details.time_of_day}`;
                if (details?.min_happiness) method += ` w/ high happiness`;
                if (details?.gender === 1) method += ` (Female)`;
                if (details?.gender === 2) method += ` (Male)`;
                if (details?.min_affection) method += ` w/ high affection`;
                
                return renderStage(nextStage, depth + 1, method);
              })}
            </div>
          )}
        </div>
      );
    }
    elements.push(renderStage(chainLink));
    return elements;
  };

  const mainSpriteUrl = showShiny
  ? getShowdownSpriteUrl(pokemonData?.name || pokemonName || 'unknown', true)
  : getShowdownSpriteUrl(pokemonData?.name || pokemonName || 'unknown', false);

  const fallbackPokeApiSprite = pokemonData?.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemonData?.sprites.front_default;

  const MainSpriteComponent = () => (
    <img
        src={mainSpriteUrl}
        alt={`${pokemonData?.name || 'Pokemon'} sprite`}
        className={`w-32 h-32 md:w-40 md:h-40 object-contain ${spriteEffect.active ? 'sprite-visual-cue' : ''}`}
        style={{ '--sprite-effect-color': spriteEffect.color } as React.CSSProperties}
        onError={(e) => {
            if (fallbackPokeApiSprite) {
                e.currentTarget.src = fallbackPokeApiSprite;
            } else {
                e.currentTarget.src = `https://via.placeholder.com/160?text=${(pokemonData?.name || 'P').charAt(0)}`;
            }
        }}
    />
  );


  if (isLoading && !pokemonData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary-500" />
        <p className="ml-4 text-xl text-neutral-600 dark:text-neutral-400">Loading Pokémon Data...</p>
      </div>
    );
  }

  if (error && !pokemonData) { // Only show full-page error if no data is available at all
    return (
      <Card title="Error" className="max-w-2xl mx-auto mt-10">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertTriangle size={40} className="mr-4" />
          <p className="text-lg">{error}</p>
        </div>
        <Button onClick={() => navigate(-1)} leftIcon={<ArrowLeft />} className="mt-6">Go Back</Button>
      </Card>
    );
  }
  
  if (!pokemonData || !speciesData) {
    return (
      <div className="text-center py-10">
        <p>Pokémon data could not be fully loaded. Please try refreshing the page or going back.</p>
        <Button onClick={() => navigate(-1)} leftIcon={<ArrowLeft />} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const renderMoveSection = (title: string, movesToList: FormattedMove[], icon: React.ReactElement) => {
    if (movesToList.length === 0) return null;
    return (
      <Card title={title} icon={React.cloneElement(icon, {size:20, className: "text-primary-500"} as any)} className="mb-6 shadow-sm hover:shadow-md transition-shadow" bodyClassName="p-0">
        <details className="group" open={title.toLowerCase().includes('level up')}> {/* Open level up moves by default */}
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <div className="flex items-center">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">{title} ({movesToList.length})</span>
                </div>
                <ChevronDown className="text-neutral-500 group-open:hidden" />
                <ChevronUp className="text-neutral-500 hidden group-open:inline" />
            </summary>
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700 max-h-96 overflow-y-auto">
            {movesToList.map(move => (
                <li key={move.name + move.learnMethod} className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors">
                <button
                    onClick={() => handleMoveClick(move.url, move.name)}
                    className="w-full text-left flex justify-between items-center text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`View details for move: ${move.name}`}
                >
                    <span className="capitalize">{move.name}</span>
                    {move.learnMethod === 'level-up' && move.levelLearnedAt !== undefined && move.levelLearnedAt > 0 && 
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Lvl {move.levelLearnedAt}</span>}
                </button>
                </li>
            ))}
            </ul>
        </details>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
       <style>{`
        .sprite-visual-cue {
          animation: move-visual-effect 0.7s ease-out;
        }
        @keyframes move-visual-effect {
          0%, 100% {
            transform: scale(1);
            outline: 0px solid transparent;
            filter: brightness(1);
          }
          25% {
            transform: scale(1.08);
            filter: brightness(1.1);
          }
          50% {
            transform: scale(1.05);
            outline: 4px solid var(--sprite-effect-color);
            filter: brightness(1.25) drop-shadow(0 0 5px var(--sprite-effect-color));
        
          }
          75% {
            transform: scale(1.08);
            filter: brightness(1.1);
          }
        }
      `}</style>
      <Button onClick={() => navigate(-1)} variant="outline" leftIcon={<ArrowLeft size={16} />} className="mb-4 print:hidden">
        Back to Pokédex
      </Button>

       {error && ( // Display non-critical errors here, critical ones handled above
        <div className="my-4 p-3 rounded-md text-sm flex items-center bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200">
          <AlertTriangle size={18} className="mr-2 text-red-500"/>
          {error}
        </div>
      )}

      <Card className="mb-6 overflow-hidden">
        <div className={`p-4 md:p-6 ${getTypeClass(pokemonData.types[0].type.name, 'bg')}-lighten-30 dark:${getTypeClass(pokemonData.types[0].type.name, 'bg')}-darken-30 relative`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
                <MainSpriteComponent />
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowShiny(!showShiny)}
                    className="absolute bottom-0 right-0 p-1 bg-white/70 dark:bg-black/70 rounded-full hover:bg-white dark:hover:bg-black"
                    aria-label={showShiny ? "Show normal sprite" : "Show shiny sprite"}
                >
                    <Sparkles size={18} className={showShiny ? "text-yellow-400" : "text-neutral-500"} />
                </Button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 capitalize">
                {pokemonData.name.replace(/-/g, ' ')}
                <span className="ml-2 text-2xl md:text-3xl text-neutral-500 dark:text-neutral-400">#{pokemonData.id.toString().padStart(3, '0')}</span>
              </h1>
              <div className="flex justify-center md:justify-start space-x-2 mt-2">
                {pokemonData.types.map(typeInfo => (
                  <span key={typeInfo.type.name} className={`px-3 py-1 text-sm font-medium text-white rounded-full shadow ${getTypeClass(typeInfo.type.name)}`}>
                    {typeInfo.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                {speciesData.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown Genus'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Pokédex Entries" icon={<BookOpen size={20} className="text-primary-500"/>}>
            {flavorTexts.length > 0 ? flavorTexts.map((entry, index) => (
              <p key={index} className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">
                <strong className="capitalize text-neutral-700 dark:text-neutral-200">Pokémon {entry.version.replace(/-/g,' ')}:</strong> {entry.text}
              </p>
            )) : <p className="text-neutral-500 dark:text-neutral-400">No English Pokédex entries available for the preferred game version.</p>}
          </Card>

          <Card title="Base Stats" icon={<TrendingUp size={20} className="text-primary-500"/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsForChart}>
                    <PolarGrid stroke="var(--color-neutral-300, #d4d4d4)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text, #111827)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 20']} tick={false} axisLine={false} />
                    <Radar name={pokemonData.name} dataKey="value" stroke="var(--color-primary, #3b82f6)" fill="var(--color-primary, #3b82f6)" fillOpacity={0.6} />
                    <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-background, #f3f4f6)', border: '1px solid var(--color-secondary, #64748b)', borderRadius: '0.375rem' }} itemStyle={{color: 'var(--color-text)'}}/>
                    <RechartsLegend wrapperStyle={{paddingTop: '15px'}}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1 text-sm">
                {pokemonData.stats.map(s => (
                  <li key={s.stat.name} className="flex justify-between">
                    <span className="font-medium text-neutral-700 dark:text-neutral-200">{formatStatName(s.stat.name)}:</span>
                    <span className="text-neutral-600 dark:text-neutral-300">{s.base_stat}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold pt-1 border-t border-neutral-300 dark:border-neutral-600">
                  <span className="text-neutral-800 dark:text-neutral-100">Total:</span>
                  <span className="text-neutral-800 dark:text-neutral-100">{pokemonData.stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card title="Details" icon={<Info size={20} className="text-primary-500"/>}>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Height:</strong> <span className="text-neutral-600 dark:text-neutral-300">{(pokemonData.height / 10).toFixed(1)} m</span></li>
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Weight:</strong> <span className="text-neutral-600 dark:text-neutral-300">{(pokemonData.weight / 10).toFixed(1)} kg</span></li>
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Capture Rate:</strong> <span className="text-neutral-600 dark:text-neutral-300">{speciesData.capture_rate}</span></li>
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Base Happiness:</strong> <span className="text-neutral-600 dark:text-neutral-300">{speciesData.base_happiness}</span></li>
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Growth Rate:</strong> <span className="text-neutral-600 dark:text-neutral-300 capitalize">{speciesData.growth_rate.name.replace(/-/g,' ')}</span></li>
              <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Generation:</strong> <span className="text-neutral-600 dark:text-neutral-300 capitalize">{speciesData.generation.name.replace(/-/g,' ')}</span></li>
               {speciesData.habitat && <li className="flex justify-between"><strong className="text-neutral-700 dark:text-neutral-200">Habitat:</strong> <span className="text-neutral-600 dark:text-neutral-300 capitalize">{speciesData.habitat.name.replace(/-/g,' ')}</span></li>}
              <li className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-600"><strong className="text-neutral-700 dark:text-neutral-200">Abilities:</strong>
                <ul className="list-disc pl-5 mt-1">
                    {pokemonData.abilities.map((abilityInfo: AbilityInfo) => (
                    <li key={abilityInfo.ability.name} className="text-neutral-600 dark:text-neutral-300 capitalize">
                        {abilityInfo.ability.name.replace(/-/g,' ')}
                        {abilityInfo.is_hidden && <span className="ml-1 text-xs text-sky-500">(Hidden)</span>}
                    </li>
                    ))}
                </ul>
              </li>
            </ul>
          </Card>
          {evolutionChainData?.chain && (
            <Card title="Evolution Chain" icon={<Share2 size={20} className="text-primary-500"/>}>
              <div className="flex flex-wrap justify-center items-start p-2 overflow-x-auto">
                {parseEvolutionChain(evolutionChainData.chain)}
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-neutral-800 dark:text-neutral-100">Moves Learned</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Click on a move name to see its details. The visual effect on the Pokémon sprite is a representation and not an actual game animation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMoveSection("Level Up Moves", formattedMoves.levelUp, <TrendingUp/>)}
            {renderMoveSection("TM/HM Moves", formattedMoves.machine, <Swords />)}
            {renderMoveSection("Egg Moves", formattedMoves.egg, <Shield />)}
            {renderMoveSection("Tutor Moves", formattedMoves.tutor, <Zap />)}
        </div>
      </div>


      {isMoveModalOpen && selectedMove && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 print:hidden"
            onClick={() => setIsMoveModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-modal-title"
        >
          <div // Outer div for modal content, to handle click propagation
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <Card 
              title={<span id="move-modal-title" className="capitalize text-xl">{selectedMove.name.replace(/-/g,' ')}</span>} 
              className="bg-white dark:bg-neutral-800 shadow-xl"
            >
              <div className="space-y-3 text-sm">
                <p><strong className="text-neutral-700 dark:text-neutral-200">Type:</strong> <span className={`px-2 py-0.5 text-xs text-white rounded-full shadow-sm ${getTypeClass(selectedMove.type.name)}`}>{selectedMove.type.name.toUpperCase()}</span></p>
                <p><strong className="text-neutral-700 dark:text-neutral-200">Category:</strong> <span className="capitalize text-neutral-600 dark:text-neutral-300">{selectedMove.damage_class.name}</span></p>
                <p><strong className="text-neutral-700 dark:text-neutral-200">Power:</strong> <span className="text-neutral-600 dark:text-neutral-300">{selectedMove.power ?? 'N/A'}</span></p>
                <p><strong className="text-neutral-700 dark:text-neutral-200">Accuracy:</strong> <span className="text-neutral-600 dark:text-neutral-300">{selectedMove.accuracy ?? 'N/A'}%</span></p>
                <p><strong className="text-neutral-700 dark:text-neutral-200">PP:</strong> <span className="text-neutral-600 dark:text-neutral-300">{selectedMove.pp}</span></p>
                <p className="pt-2 border-t border-neutral-200 dark:border-neutral-600">
                  <strong className="text-neutral-700 dark:text-neutral-200">Effect:</strong>
                  <span className="block mt-1 text-neutral-600 dark:text-neutral-300">
                    {selectedMove.effect_entries.find(e => e.language.name === 'en')?.effect.replace('$effect_chance', selectedMove.effect_chance?.toString() || '') || 'No English description available.'}
                  </span>
                </p>
              </div>
              <div className="mt-6 text-right">
                <Button onClick={() => setIsMoveModalOpen(false)} variant="primary">Close</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
