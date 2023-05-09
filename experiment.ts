import { StargateClient } from "@cosmjs/stargate";

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
};

runAll();
