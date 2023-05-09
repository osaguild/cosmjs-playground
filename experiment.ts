import { IndexedTx, StargateClient } from "@cosmjs/stargate";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

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
};

runAll();
