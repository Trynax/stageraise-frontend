'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit"

interface ButtonConnectProps {
    accountStatus?: "full" | "avatar" | "address"
    chainStatus?: "icon" | "name" | "none"
}

export function ButtonConnect({ accountStatus = "full", chainStatus = "icon" }: ButtonConnectProps) {
    return (
        <div style={{ whiteSpace: "nowrap", minWidth: accountStatus === "avatar" ? "auto" : 140 }}>
            <ConnectButton showBalance={false} chainStatus={chainStatus} accountStatus={accountStatus} />
        </div>
    )
}