import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useConnection} from '@solana/wallet-adapter-react';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {useAuthorization, Account} from '../components/AuthorizationProvider';
import DisconnectButton from '../components/DisconnectButton';
import RequestAirdropButton from '../components/RequestAirdropButton';
import SignMessageButton from '../components/SignMessageButton';
import SignTransactionButton from '../components/SignTransactionButton';

export default function MainScreen() {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      console.log('Fetching balance for: ' + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      console.log('Balance fetched: ' + fetchedBalance);
      setBalance(fetchedBalance);
    },
    [connection],
  );

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="Sign a transaction">
                <SignTransactionButton />
              </Section>

              <Section title="Sign a message">
                <SignMessageButton />
              </Section>

              <Section title="Account Info">
                <AccountInfo
                  selectedAccount={selectedAccount}
                  balance={balance}
                />
                <RequestAirdropButton
                  selectedAccount={selectedAccount}
                  onAirdropComplete={async (account: Account) =>
                    await fetchAndUpdateBalance(account)
                  }
                />
              </Section>
            </>
          ) : null}
        </ScrollView>

        {selectedAccount ? (
          <DisconnectButton title="Disconnect wallet" />
        ) : (
          <ConnectButton title="Connect wallet" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 16,
    flex: 1,
  },
  scrollContainer: {
    height: '100%',
  },
  buttonGroup: {
    flexDirection: 'column',
    paddingVertical: 4,
  },
});
