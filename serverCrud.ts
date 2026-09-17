type Party = {
  id: number;
  name: string;
  leader: string;
  seats: number;
};

type PartyParams = {
  id: string;
};

let parties: Party[] = [
  {
    id: 1,
    name: "Social Democrats",
    leader: "Magdalena Andersson",
    seats: 107,
  },
  {
    id: 2,
    name: "Sweden Democrats",
    leader: "Jimmie Åkesson",
    seats: 73,
  },
  {
    id: 3,
    name: "Moderate Party",
    leader: "Ulf Kristersson",
    seats: 68,
  },
  {
    id: 4,
    name: "Centre Party",
    leader: "Elisabeth Thand Ringqvist",
    seats: 24,
  },
  {
    id: 5,
    name: "Left Party",
    leader: "Nooshi Dadgostar",
    seats: 24,
  },
  {
    id: 6,
    name: "Christian Democrats",
    leader: "Ebba Busch",
    seats: 19,
  },
  {
    id: 7,
    name: "Green Party",
    leader: "Daniel Helldén and Amanda Lind",
    seats: 18,
  },
  {
    id: 8,
    name: "Liberals",
    leader: "Simona Mohamsson",
    seats: 16,
  },
];

import express from "express";

const app = express();

app.use(express.json());

const PORT = 3302;

//Task 1: List All Parties

app.get("/parties", (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "successfully get all parties", parties });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});
//Task 2: Add a New Party
app.post("/parties", (req, res) => {
  try {
    const { name, leader, seats } = req.body;
    const newParty = { id: parties.length + 1, name, leader, seats };
    parties.push(newParty);
    return res.status(201).json({
      message: "successfully added parties",
      party: newParty,
      parties,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Task 4: Update a Party's Info
app.put("/parties/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, leader, seats } = req.body;

    const partyIndex = parties.findIndex(
      (party) => Number(party.id) === Number(id),
    );

    if (partyIndex === -1) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    parties[partyIndex] = {
      ...parties[partyIndex],
      ...(name !== undefined && { name }),
      ...(leader !== undefined && { leader }),
      ...(seats !== undefined && { seats }),
    };

    return res.status(200).json({
      message: "Successfully updated party",
      party: parties[partyIndex],
      parties,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// Task 5: Remove a Party
app.delete("/parties/:id", (req, res) => {
  try {
    const { id } = req.params;

    const findParty = parties.find((party) => Number(party.id) === Number(id));

    if (!findParty) {
      return res.status(404).json({
        message: "Party not found",
      });
    }
    parties = parties.filter((party) => Number(party.id) !== Number(id));

    return res.status(200).json({
      message: "Successfully deleted party",
      deletedParty: findParty,
      parties,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//Task 6: Handling Bad Input
app.post("/error-parties", (req, res) => {
  try {
    const { name, leader, seats } = req.body;
    if (!name) {
      return res.status(400).json({ message: "u should write party name" });
    }
    if (!leader) {
      return res.status(400).json({ message: "u should write leader name" });
    }
    const newParty = { id: parties.length + 1, name, leader, seats };
    parties.push(newParty);
    return res.status(201).json({
      message: "successfully added parties",
      party: newParty,
      parties,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

//Task 8: Explicit Status on Create

app.get("/parties/seats-total", (req, res) => {
  try {
    const totalSeats = parties.reduce((total, party) => total + party.seats, 0);
    return res.status(200).json({ message: "totalSeats", totalSeats });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});
app.get("/parties/:id", (req, res) => {
  const { id } = req.params;

  const party = parties.find((party) => Number(party.id) === Number(id));

  if (!party) {
    return res.status(404).json({
      message: "Party not found",
    });
  }

  return res.status(200).json(party);
});
//

app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
