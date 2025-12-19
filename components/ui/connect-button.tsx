'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit"

export function ButtonConnect() {
    return (
        <ConnectButton showBalance={false} chainStatus="icon" />
    )
}
