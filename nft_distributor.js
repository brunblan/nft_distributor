const fs = require('fs');
const colors = require('colors');
const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const { getParsedTokenAccountsByOwner, getMint, createTransferInstruction } = require('@solana/spl-token');

const connection = new Connection('YOUR_RPC_ENDPOINT', 'confirmed');
const stages = [
  { min: 10000, max: 100000, name: 'First Stage', max_winners: 10 },
  { min: 100001, max: 250000, name: 'Second Stage', max_winners: 5 },
  { min: 250001, max: 500000, name: 'Third Stage', max_winners: 3 },
  { min: 500001, max: 1000000, name: 'Fourth Stage', max_winners: 2 },
  { min: 1000001, max: 2500000, name: 'Fifth Stage', max_winners: 1 }
];

// Load keypair
const keypairPath = 'PATH_TO_YOUR_PRIVATE_KEY';
const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Load NFTs from file
let nftDatabase = JSON.parse(fs.readFileSync('nfts.json', 'utf8'));

// Utility functions
function calculatePercentage(totalSupply, balance) {
  return ((balance / totalSupply) * 100).toFixed(2);
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function logToFile(message) {
  fs.appendFileSync('nft_distribution.log', `${new Date().toISOString()} - ${message}\n`);
}

function logTransaction(wallet, nft, stage, dryRun = false) {
  const status = dryRun ? '[DRY RUN] ' : '';
  const message = `${status}Transaction:
  Wallet: ${wallet.green}
  NFT: ${nft.name.yellow} (Mint: ${nft.mint.cyan})
  Stage: ${stage.magenta}`;
  
  console.log(message);
  logToFile(message.replace(/\x1b\[\d+m/g, ''));
}

function updateNFTDatabase(stage, usedNFT) {
  const index = nftDatabase[stage].findIndex(nft => nft.mint === usedNFT.mint);
  if (index !== -1) {
    nftDatabase[stage].splice(index, 1);
    fs.writeFileSync('nfts.json', JSON.stringify(nftDatabase, null, 2));
  }
}

async function getTokenHolders(mintAddress) {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mintPublicKey);
    const totalSupply = Number(mintInfo.supply);

    const tokenAccounts = await connection.getParsedProgramAccounts(
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      {
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 0, bytes: mintAddress } }
        ]
      }
    );

    const holders = tokenAccounts.map(account => {
      const parsedData = account.account.data.parsed.info;
      return {
        wallet: parsedData.owner,
        balance: Number(parsedData.tokenAmount.amount)
      };
    });

    return { holders, totalSupply };
  } catch (error) {
    console.error('Error fetching token holders:'.red, error);
    logToFile(`Error fetching token holders: ${error.message}`);
    return { holders: [], totalSupply: 0 };
  }
}

async function transferNFT(fromWallet, toWallet, nftMint, dryRun) {
  if (dryRun) return true;

  const fromTokenAccount = await connection.getTokenAccountsByOwner(
    fromWallet.publicKey,
    { mint: new PublicKey(nftMint) }
  );

  if (!fromTokenAccount.value.length) {
    throw new Error(`NFT ${nftMint} not found in source wallet`);
  }

  const transaction = new Transaction().add(
    createTransferInstruction(
      fromTokenAccount.value[0].pubkey,
      new PublicKey(toWallet),
      fromWallet.publicKey,
      1
    )
  );

  const signature = await connection.sendTransaction(transaction, [fromWallet]);
  await connection.confirmTransaction(signature);
  return signature;
}

async function distributeNFTs(holders, totalSupply, dryRun) {
  const winners = new Set();
  const transactions = [];

  const holdersWithPercentage = holders.map(holder => ({
    ...holder,
    percentage: calculatePercentage(totalSupply, holder.balance)
  }));

  for (const stage of stages) {
    const eligibleHolders = holdersWithPercentage.filter(
      h => h.balance >= stage.min && 
           h.balance <= stage.max && 
           !winners.has(h.wallet)
    );

    const availableNFTs = [...nftDatabase[stage.name]];
    
    for (let i = 0; i < Math.min(stage.max_winners, eligibleHolders.length); i++) {
      if (availableNFTs.length === 0) break;
      
      const winnerIndex = Math.floor(Math.random() * eligibleHolders.length);
      const winner = eligibleHolders[winnerIndex];
      
      if (!winner) continue;
      
      const nftIndex = Math.floor(Math.random() * availableNFTs.length);
      const nft = availableNFTs[nftIndex];
      
      try {
        const txSignature = await transferNFT(wallet, winner.wallet, nft.mint, dryRun);
        transactions.push({
          wallet: winner.wallet,
          nft,
          stage: stage.name,
          signature: dryRun ? 'DRY_RUN' : txSignature
        });
        
        if (!dryRun) {
          updateNFTDatabase(stage.name, nft);
        }
        
        winners.add(winner.wallet);
        availableNFTs.splice(nftIndex, 1);
        eligibleHolders.splice(winnerIndex, 1);
      } catch (error) {
        console.error(`Error transferring NFT: ${error.message}`.red);
        logToFile(`Error transferring NFT to ${winner.wallet}: ${error.message}`);
      }
    }
  }

  return transactions;
}

async function main(mintAddress, dryRun = false) {
  console.log(`Starting NFT Distribution on Solana${dryRun ? ' (Dry Run)' : ''}`.blue.bold);
  logToFile(`Starting NFT Distribution on Solana${dryRun ? ' (Dry Run)' : ''}`);

  const { holders, totalSupply } = await getTokenHolders(mintAddress);
  
  if (!holders.length) {
    console.log('No holders found for this token'.red);
    return;
  }

  console.log(`Total Supply: ${totalSupply.toLocaleString()} tokens`.green);
  console.log(`Total Holders: ${holders.length}`.green);
  logToFile(`Total Supply: ${totalSupply} tokens, Total Holders: ${holders.length}`);

  const transactions = await distributeNFTs(holders, totalSupply, dryRun);
  
  console.log('\nDistribution Results:'.blue.bold);
  transactions.forEach(tx => logTransaction(tx.wallet, tx.nft, tx.stage, dryRun));
  
  console.log(`\nTotal NFTs Distributed: ${transactions.length}`.green);
  logToFile(`Total NFTs Distributed: ${transactions.length}`);
}

// Execute
const TOKEN_MINT_ADDRESS = 'YOUR_TOKEN_ADDRESS';
const DRY_RUN = process.argv.includes('--dry-run');
main(TOKEN_MINT_ADDRESS, DRY_RUN).catch(error => {
  console.error('Error:'.red, error);
  logToFile(`Error: ${error.message}`);
});
