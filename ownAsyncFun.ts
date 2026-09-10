const fetchPokemonById = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) {
      throw new Error("Sorry, we couldn't find that Pokémon.");
    }
    const data = await res.json();

    console.log("Pokémon Forms:", data.forms);
  } catch (error) {
    console.log("Error:", error);
  }
};

fetchPokemonById(1);
