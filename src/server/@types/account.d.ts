declare global {
	interface Account {
		id: number,
		loginTries: number;
		logged: boolean;
		chat?: {
			width: number,
			height: number,
			fontSize: number,
			spacing: number,
			links: boolean
		},
		operator: boolean,
		staff: boolean,
		cash: number,
		bank: number,
	}
	
	interface PlayerMp {
		account: Account;
		chat: Chat;
	}
}

export {};