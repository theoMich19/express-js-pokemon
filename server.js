const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 3000;

// Configuration de la base de données SQLite3
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // Nom du fichier de base de données
});

// Définition du modèle Pokemon
const Pokemon = sequelize.define("Pokemon", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pokemon_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date_capture: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Synchronisation du modèle avec la base de données
sequelize.sync();

// Middleware to parse JSON requests
app.use(express.json());

// ******************* Routes *******************

// Route pour créer un nouveau Pokémon (POST request)
app.post("/pokemons", async (req, res) => {
  try {
    const newPokemon = await Pokemon.create(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route pour mettre à jour un Pokémon par ID (PUT request)
app.put("/pokemons/:id", async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const pokemon = await Pokemon.findByPk(pokemonId);

    if (pokemon) {
      // Mise à jour des attributs du Pokémon
      await pokemon.update(req.body);

      res.json({ message: "Pokemon has been update", data: pokemon });
    } else {
      res.status(404).send("Pokemon not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route pour obtenir la liste de tous les Pokémon (GET request)
app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await Pokemon.findAll();
    res.json(pokemons);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route pour obtenir les détails d'un Pokémon par ID (GET request)
app.get("/pokemons/:id", async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const pokemon = await Pokemon.findByPk(pokemonId);

    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).send("Pokemon not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route pour supprimer un Pokémon par ID (DELETE request)
app.delete("/pokemons/:id", async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const pokemon = await Pokemon.findByPk(pokemonId);

    if (pokemon) {
      await pokemon.destroy();
      res.json({ message: "Pokemon has been delete" });
      res.sendStatus(200);
    } else {
      res.status(404).send("Pokemon not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur des pokemons fonctionne sur le port ${port}`);
});
