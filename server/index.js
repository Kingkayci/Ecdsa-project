const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04f477adc1db453157bc08a5c9c4c2df2eb2886df0aad7c2a44ad6fe912a0e1d2cc8a057193911a3b2584806fbd3de1202b19597b67b04452d791936caa5c3d5b8": 100,
  "04d1bbf6ef4ce8b152ecbafe0f148c31cf5924d3c848bd0b9033d0162dd736c5998d3d60083e89fe4b63a06635ea7ab3127da0f7f434f1e60d9209cbc918c5942b": 50, 
  "042c7e66772daa28f3f16a4158c5722cbd1e3531bc84224b1acc9bc13db11a2983fc8503039b319109200f420256b5c620ef75f65c0856791481ee474200ccc538": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
