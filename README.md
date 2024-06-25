# L2 Subnames!

This repository contains a proof of concept code for issuing subnames on L2 chains.
In a nutshell, every name has a separate NFT contract, deployed on an L2 chain. The minters can mint a subname via NameRegistryController contract.

NameFactory is responsible for allowing listing a name only to a lister who really owns a name on mainnet. 

## Resolution
The subs are resolvable by ccip-gateway, using the ccip-read protocol (until we get an emv-gateway running). 

![resolution](https://namespace.fra1.cdn.digitaloceanspaces.com/misc/Resolution.png)


## Minting

![Minting](https://namespace.fra1.cdn.digitaloceanspaces.com/misc/Minting.png)

## Setting Records
![Records management](https://namespace.fra1.cdn.digitaloceanspaces.com/misc/Setting-Records.png)