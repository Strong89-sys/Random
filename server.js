const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const COMMANDES_FILE = path.join(__dirname, 'commandes.json');

app.use(cors());
app.use(express.json());

// 🔁 Lire toutes les commandes
app.get('/commandes', (req, res) => {
  fs.readFile(COMMANDES_FILE, 'utf-8', (err, data) => {
    if (err) {
      console.error("Erreur lecture :", err);
      return res.status(500).send("Erreur lecture commandes");
    }
    const commandes = JSON.parse(data || '[]');
    res.json(commandes);
  });
});

// ➕ Ajouter une commande
app.post('/commandes', (req, res) => {
  const nouvelleCommande = req.body;

  fs.readFile(COMMANDES_FILE, 'utf-8', (err, data) => {
    const commandes = JSON.parse(data || '[]');
    commandes.push(nouvelleCommande);

    fs.writeFile(COMMANDES_FILE, JSON.stringify(commandes, null, 2), (err) => {
      if (err) {
        console.error("Erreur écriture :", err);
        return res.status(500).send("Erreur ajout commande");
      }
      res.status(201).send("✅ Commande ajoutée !");
    });
  });
});

// 🖊️ Modifier le statut d'une commande
app.patch('/commandes/:id', (req, res) => {
  const commandeId = parseInt(req.params.id, 10);
  const { status } = req.body;

  fs.readFile(COMMANDES_FILE, 'utf-8', (err, data) => {
    const commandes = JSON.parse(data || '[]');
    const index = commandes.findIndex(c => c.id === commandeId);

    if (index === -1) {
      return res.status(404).send("Commande introuvable");
    }

    commandes[index].status = status;

    fs.writeFile(COMMANDES_FILE, JSON.stringify(commandes, null, 2), (err) => {
      if (err) {
        console.error("Erreur mise à jour :", err);
        return res.status(500).send("Erreur mise à jour");
      }
      res.send("✅ Statut mis à jour");
    });
  });
});

// 🚀 Lancer le serveur
app.listen(PORT, () => {
  console.log(`MaisonPlus backend lancé sur http://localhost:${PORT}`);
});