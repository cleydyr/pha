# PHA

A library for the [PHA](https://biblioteca.furg.br/pt/ferramentas/tabela-cutter-sanborn) call number system.

## Usage

```javascript
import { PHATableFactory } from "pha";

const phaTable = PHATableFactory.createTable();

phaTable.callNumber("lentino", "noemia") === 589; // true
phaTable.callNumber("prado", "heloisa") === 917; // true
```

## Testing

To run the tests for this library, use the following command:

```bash
npm run test
```
