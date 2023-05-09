import {
  IndexedTx,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import {
  DirectSecp256k1HdWallet,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { readFile } from "fs/promises";

const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657";

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

  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  const faucetTx: IndexedTx = (await client.getTx(
    "7748F517D0BF4B00049486AB83E1866B54F1904B03FFD6102960FFBE7A51EB48"
  ))!;
  console.log("Faucet Tx:", faucetTx);

  const decodedTx = Tx.decode(faucetTx.tx);
  console.log("DecodedTx:", decodedTx);
  console.log("Decoded messages:", decodedTx.body!.messages);

  const sendMessage: MsgSend = MsgSend.decode(
    decodedTx.body!.messages[0].value
  );
  console.log("Sent message:", sendMessage);

  const faucet: string = sendMessage.fromAddress;
  console.log("Faucet balances:", await client.getAllBalances(faucet));

  const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
  const alice = (await aliceSigner.getAccounts())[0].address;
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
    [{ denom: "uatom", amount: "100000" }],
    {
      amount: [{ denom: "uatom", amount: "500" }],
      gas: "200000",
    }
  );
  // Output the result of the Tx
  console.log("Transfer result:", result);

  console.log("Alice balance after:", await client.getAllBalances(alice));
  console.log("Faucet balance after:", await client.getAllBalances(faucet));
};

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic(
    (await readFile("./testnet.alice.mnemonic.key")).toString(),
    {
      prefix: "cosmos",
    }
  );
};

runAll();
