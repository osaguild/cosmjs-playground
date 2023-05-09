"use client";
import { ChangeEvent, Component, MouseEvent } from "react";
import { StargateClient, Coin } from "@cosmjs/stargate";
import styles from "../app/Page.module.css";

interface FaucetSenderState {
  denom: string;
  faucetBalance: string;
  myAddress: string;
  myBalance: string;
  toSend: string;
}

export interface FaucetSenderProps {
  faucetAddress: string;
  rpcUrl: string;
}

export class FaucetSender extends Component<
  FaucetSenderProps,
  FaucetSenderState
> {
  // Set the initial state
  constructor(props: FaucetSenderProps) {
    super(props);
    this.state = {
      denom: "Loading...",
      faucetBalance: "Loading...",
      myAddress: "Click first",
      myBalance: "Click first",
      toSend: "0",
    };
    setTimeout(this.init, 500);
  }

  init = async () =>
    this.updateFaucetBalance(await StargateClient.connect(this.props.rpcUrl));

  // Get the faucet's balance
  updateFaucetBalance = async (client: StargateClient) => {
    const balances: readonly Coin[] = await client.getAllBalances(
      this.props.faucetAddress
    );
    const first: Coin = balances[0];
    this.setState({
      denom: first.denom,
      faucetBalance: first.amount,
    });
  };

  // Store changed token amount to state
  onToSendChanged = (e: ChangeEvent<HTMLInputElement>) =>
    this.setState({
      toSend: e.currentTarget.value,
    });

  // When the user clicks the "send to faucet button"
  onSendClicked = async (e: MouseEvent<HTMLButtonElement>) => {
    alert("TODO");
  };

  // The render function that draws the component at init and at state change
  render() {
    const { denom, faucetBalance, myAddress, myBalance, toSend } = this.state;
    const { faucetAddress } = this.props;
    console.log(toSend);
    // The web page structure itself
    return (
      <div>
        <fieldset className={styles.card}>
          <legend>Faucet</legend>
          <p>Address: {faucetAddress}</p>
          <p>Balance: {faucetBalance}</p>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>You</legend>
          <p>Address: {myAddress}</p>
          <p>Balance: {myBalance}</p>
        </fieldset>
        <fieldset className={styles.card}>
          <legend>Send</legend>
          <p>To faucet:</p>
          <input
            value={toSend}
            type="number"
            onChange={this.onToSendChanged}
          />{" "}
          {denom}
          <button onClick={this.onSendClicked}>Send to faucet</button>
        </fieldset>
      </div>
    );
  }
}
