"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectorsForWallets, darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
	coinbaseWallet,
	injectedWallet,
	metaMaskWallet,
	rabbyWallet,
	rainbowWallet,
	walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { MotionConfig } from "framer-motion";
import { useState, type ReactNode } from "react";
import { defineChain } from "viem";
import { createConfig, http, WagmiProvider } from "wagmi";

import { appEnv } from "@/lib/config/env";

const abstract = defineChain({
	id: appEnv.chainId,
	name: "Abstract",
	nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
	rpcUrls: {
		default: { http: [appEnv.abstractRpcUrl] },
	},
	blockExplorers: {
		default: { name: "Abscan", url: "https://abscan.org" },
	},
});

const walletGroups = [
	{
		groupName: "Recommended",
		wallets: [
			metaMaskWallet,
			rabbyWallet,
			rainbowWallet,
			coinbaseWallet,
			injectedWallet,
			...(appEnv.walletConnectProjectId ? [walletConnectWallet] : []),
		],
	},
];

const connectors = connectorsForWallets(walletGroups, {
	appName: appEnv.appName,
	projectId: appEnv.walletConnectProjectId ?? "walletconnect-project-id-required",
});

const wagmiConfig = createConfig({
	chains: [abstract],
	connectors,
	transports: {
		[abstract.id]: http(appEnv.abstractRpcUrl),
	},
});

type ProvidersProps = {
	children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					theme={darkTheme({
						accentColor: "#20f7ff",
						accentColorForeground: "#031018",
						borderRadius: "small",
						overlayBlur: "small",
					})}
				>
					<MotionConfig reducedMotion="user">{children}</MotionConfig>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
