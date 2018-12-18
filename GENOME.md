# Encoding monster attributes in their genome

⚠️ Work in progress ⚠️

This is the bare minimum, I'm focusing on building the game before doing gene mapping more seriously.

Genes are encoded on a uint256 (256 bits).

## First 16 bits are encoding the body type

     xxxx xxxx xxxx xxxx
bin: 0000 0000 0000 0001
hex:    0    0    0    1


color pattern, eyes, mouth, ears,
