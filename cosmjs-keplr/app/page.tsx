import type { NextPage } from "next";
import { FaucetSender } from "../components/FaucetSender";

const Page: NextPage = () => {
  return (
    <FaucetSender
      faucetAddress="cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he"
      rpcUrl="rpc.sentry-01.theta-testnet.polypore.xyz"
    />
  );
};

export default Page;
