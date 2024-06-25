import { useAccount, useDisconnect } from "wagmi";
import "./TopNavigation.css";
import { Card, Profile } from "@ensdomains/thorin";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMainnetPublicClient } from "../web3/useMainnetPublicClient";

export const TopNavigation = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const publicClient = useMainnetPublicClient();
  const [toggle, setToggle] = useState(false);
  const [ensProfile, setProfile] = useState<{
    avatar?: string;
    name?: string;
  }>({});

  useEffect(() => {
    if (!address) {
      return;
    }

    const fetchProfile = async () => {
      const ensName = await publicClient?.getEnsName({ address: address });
      let avatar;
      if (ensName) {
        avatar = await publicClient?.getEnsText({
          key: "avatar",
          name: ensName,
        });
      }
      setProfile({
        avatar: avatar || undefined,
        name: ensName || undefined,
      });
    };
    fetchProfile();
  }, [address]);

  if (!isConnected || !address) {
    return (
      <div className="top-navigation">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="top-navigation">
      <div className="profile-container" onClick={() => setToggle(!toggle)}>
      <Profile
        address={address as any}
        avatar={ensProfile.avatar}
        ensName={ensProfile.name}
      />
       {toggle && <Card onClick={() => disconnect()} className="disconnect p-3">Disconnect</Card>}
      </div>
    </div>
  );
};
