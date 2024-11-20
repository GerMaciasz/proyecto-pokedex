let allPokemons = []; 
let currentPage = 1
const POKEMONS_PER_PAGE = 50

const getPokemons = async (limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
    try {
        const response = await axios.get(url);
        const infoPokemons = response.data.results;

        const pokemonDetails = await Promise.all(
            infoPokemons.map(async (pokemon) => {
                const moreInfoPokemon = await axios.get(pokemon.url);
                return {
                    nombre: pokemon.name,
                    urlImage: moreInfoPokemon.data.sprites.other["official-artwork"].front_default,
                    tipo: moreInfoPokemon.data.types.map((tipo) => tipo.type.name),
                    peso: moreInfoPokemon.data.weight,
                    ataques: moreInfoPokemon.data.moves.slice(0, 8).map((move) => move.move.name),
                };
            })
        );
        allPokemons = pokemonDetails;
        displayPokemons()
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
    }
};

const displayPokemons = () => {
    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE
    const endIndex = startIndex + POKEMONS_PER_PAGE
    const pokemonsToDsiplay = allPokemons.slice(startIndex, endIndex)

    clearContainer()
    createCards(pokemonsToDsiplay);

    const loadMoreButton = document.getElementById("load-more")
    if (endIndex >= allPokemons.length)
        loadMoreButton.style.display = "none"
}

clearContainer = () => {
    console.log("clearContainer ejecutado"); 
    const pokemonContainer = document.getElementById("pokemon-container")
    pokemonContainer.innerHTML = ""
}


let createCards = (pokemons) => {
    let pokemonContainer = document.getElementById("pokemon-container")
    pokemons.forEach((pokemon) => {
        let card = document.createElement("div")
        let innerCard = document.createElement("div")
        let frontCard = document.createElement("div")
        let backCard = document.createElement("div")

        let image = document.createElement("img")
        let title = document.createElement("p")
        let tipo = document.createElement("p")
        let peso = document.createElement("p")
        let ataque = document.createElement("p")



        title.innerText = pokemon.nombre
        image.src = pokemon.urlImage
        tipo.innerText = `Tipos: ${pokemon.tipo.join(", ")}`
        peso.innerText = `Peso: ${pokemon.peso} kg`
        ataque.innerText = `Ataques: ${pokemon.ataques.join(", ")}, and more.`

        card.setAttribute("class", "card")
        innerCard.setAttribute("class", "card-inner")
        frontCard.setAttribute("class", "card-front")
        backCard.setAttribute("class","card-back")

        title.setAttribute("class","pokemon-name")
        image.setAttribute("class","pokemon-img")
        tipo.setAttribute("class","pokemon-tipo")
        peso.setAttribute("class","pokemon-peso")
        ataque.setAttribute("class","pokemon-ataque")

        frontCard.append(image, title)
        backCard.append(tipo, peso, ataque)
        innerCard.append(frontCard, backCard)
        card.append(innerCard)

        pokemonContainer.append(card)

    })
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search");
    const searchForm = document.getElementById("pokemon-form")
    const pokemonContainer = document.getElementById("pokemon-container");

    searchForm.addEventListener("input", (event) => {
        event.preventDefault();
    })

    const clearContainer = () => {
        pokemonContainer.innerHTML = "";
    };

    searchBar.addEventListener("input", (event) => {
        const searchText = event.target.value.toLowerCase();

        const filteredPokemons = allPokemons.filter((pokemon) =>
            pokemon.nombre.includes(searchText)
        );

        clearContainer();

        if (filteredPokemons.length > 0) {
            createCards(filteredPokemons);
        } else {
            const noResults = document.createElement("p");
            noResults.innerText = "No se encontraron resultados";
            noResults.setAttribute("class", "no-results");
            pokemonContainer.append(noResults);
        }
    });
});

document.getElementById("load-more").addEventListener("click", () => {
    currentPage++;
    displayPokemons();
})


