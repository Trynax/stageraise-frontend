'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit"

interface ButtonConnectProps {
    accountStatus?: "full" | "avatar" | "address"
}

export function ButtonConnect({ accountStatus = "full" }: ButtonConnectProps) {
    return (
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus={accountStatus} />
    )
}
