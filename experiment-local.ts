import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import {
  DirectSecp256k1Wallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";

import { fromHex } from "@cosmjs/encoding";
import { readFile } from "fs/promises";

const rpc = "http://127.0.0.1:26657";

const runAll = async (): Promise<void> => {
  const client = await StargateClient.connect(rpc);
  console.log(
    "With client, chain id:",
    await client.getChainId(),
    ", height:",
    await client.getHeight()
  );

  console.log(
    "Alice balances:",
    await client.getAllBalances("cosmos149rwzl29q5qt706pz8yewwe6sr35npry0pc4qf")
  );
  const aliceSigner: OfflineDirectSigner = await getAliceSignerFromPriKey();
  const alice = (await aliceSigner.getAccounts())[0].address;
  const faucet: string = "cosmos1umpxwaezmad426nt7dx3xzv5u0u7wjc0kj7ple";
  console.log("Alice's address from signer", alice);

  const signingClient = await SigningStargateClient.connectWithSigner(
    rpc,
    aliceSigner
  );
  console.log(
    "With signing client, chain id:",
    await signingClient.getChainId(),
    ", height:",
    await signingClient.getHeight()
  );

  // Check the balance of Alice and the Faucet
  console.log("Alice balance before:", await client.getAllBalances(alice));
  console.log("Faucet balance before:", await client.getAllBalances(faucet));
  // Execute the sendTokens Tx and store the result
  const result = await signingClient.sendTokens(
    alice,
    faucet,
    [{ denom: "stake", amount: "100000" }],
    {
      amount: [{ denom: "stake", amount: "500" }],
      gas: "200000",
    }
  );
  // Output the result of the Tx
  console.log("Transfer result:", result);

  console.log("Alice balance after:", await client.getAllBalances(alice));
  console.log("Faucet balance after:", await client.getAllBalances(faucet));
};

const getAliceSignerFromPriKey = async (): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1Wallet.fromKey(
    fromHex((await readFile("./simd.alice.private.key")).toString()),
    "cosmos"
  );
};

runAll();
