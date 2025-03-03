# nft_distributor

## Basic info:

Replace:


YOUR_RPC_ENDPOINT - with url to solana rpc node (for example one from https://www.helius.dev/)
PATH_TO_YOUR_PRIVATE_KEY - with path to your keypar used to sign transactions
YOUR_TOKEN_ADDRESS - with your token mint address

## Options

You can start script with '--dry-run' argument which just prints out what it will do without doing any real transactions

## Example output

```
root@solana:~/nft_distributor# nodejs waffle.js --dry-run
Starting NFT Distribution on Solana (Dry Run)
Total Supply: 997,305,477,474,013 tokens
Total Holders: 4787

Distribution Results:
[DRY RUN] Transaction:
  Wallet: 7gxrCAhbB2N9t5KkHimpx6WyY5AXdUw4Gm97MiZ9vxTz
  NFT: Awesome NFT #2 (Mint: 9X1KQELobdzqbHFp4Nik4MLd5FNLhPrXCHNGtgx52fUj)
  Stage: First Stage
[DRY RUN] Transaction:
  Wallet: 9ofcwy8LkYQvCxKYpHWsQ3qF3avshS7HdbKLW4pHUntw
  NFT: Cool NFT #1 (Mint: CfNxrRYRJHwsC4KRB8hHHXPtv73NoGdec5Jr3RmQQQgE)
  Stage: First Stage
[DRY RUN] Transaction:
  Wallet: G2zqns6jAKngzYT8TpyLXzAC8DGMKrKThTdaQ4zRwNNm
  NFT: Rare NFT #3 (Mint: G5AVzyTrTbJuUTJXSeeqrPewNAnskNZqtRdPkZyQvxoh)
  Stage: First Stage
[DRY RUN] Transaction:
  Wallet: Hz3nbPKMaJfDE5xw8Xe9kKaEp9qB286v2uLepgxhYJNy
  NFT: Legendary NFT #5 (Mint: 7kcAiwNe676tyVSaiAjGwt2Ff6NngCvYekU4nthhMxGJ)
  Stage: Second Stage
[DRY RUN] Transaction:
  Wallet: 3JB2Mdio2MX5Gv8ucmxgEph3MS5fLviAxNx3fSsbHX3E
  NFT: Epic NFT #4 (Mint: J4BZkJRRabCRWWrKBvM1C4vXaipbrenYYPKg48UhZHqh)
  Stage: Second Stage
[DRY RUN] Transaction:
  Wallet: 7BwX1VNnBFb3PuD98rivAuAiWUuBF79USWhfBwRkF7vf
  NFT: Mythic NFT #6 (Mint: BiMrnvbRifmrtZ7e2nnfnyHTHdEhWrUwDFqx7iBJ13s9)
  Stage: Third Stage
[DRY RUN] Transaction:
  Wallet: BFoxX8rM6WysahVtdF38WZbf39y3mhmd8jwrd1ULpD6Z
  NFT: Golden NFT #7 (Mint: 2bt6mRgmGKVkMRET2nhKQtUkLEqKq8KsSzdXacaaHUZR)
  Stage: Third Stage
[DRY RUN] Transaction:
  Wallet: GHfb4yDotYaPysYz9gUU8ruQmA2CN7x9kMrv6nprWZ5e
  NFT: Silver NFT #8 (Mint: EBTmkEBmZSPUDB2QmqeVs91fg3nqCDNzRVyaAr5EBwQR)
  Stage: Third Stage
[DRY RUN] Transaction:
  Wallet: 34BQuoUfv3UBYpdmWorAtVEUWBvPhZTSPUr6bRCoiC4v
  NFT: Platinum NFT #9 (Mint: 5EaKE77AMyk22H9gVDHVxrrM5tZ2Ms9XZCEmdsTsBRRu)
  Stage: Fourth Stage
[DRY RUN] Transaction:
  Wallet: 5SnJd8bGhaS49tPvan4HiqQwtWDz2rLvdPBL4XaB6zHi
  NFT: Emerald NFT #11 (Mint: CvtiFLPvY89JEg1QAUg9tZnR3FJm1nTMnGdDJHLZXdnF)
  Stage: Fifth Stage

Total NFTs Distributed: 10
```

