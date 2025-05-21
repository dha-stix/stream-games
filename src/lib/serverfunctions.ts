/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	orderBy,
	query,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import db, { auth } from "./firebase";
import { createStreamUser, getGameChannels } from "../../actions/stream.action";
import { Game } from "../../types";

export const registerUser = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	const nickname = form.get("nickname") as string;

	try {
		const { user } = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		if (!user) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to create user",
			};
		}
		const docRef = doc(db, "leaderboard", user.uid);
		await setDoc(docRef, {
			email,
			nickname,
			score: 0,
		});

		const streamUser = await createStreamUser(
			user.uid,
			nickname,
			`https://api.dicebear.com/9.x/pixel-art/svg?seed=${nickname}`
		);

		return {
			code: "auth/success",
			status: 200,
			user,
			message: "Acount created successfully! 🎉",
			streamUser,
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to create user",
			error: err,
		};
	}
};

export const loginUser = async (form: FormData) => {
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		if (!user) {
			return {
				code: "auth/failed",
				status: 500,
				user: null,
				message: "Failed to login user",
			};
		}

		const result = await getGameChannels(user.uid);

		console.log("Result:", result);

		return {
			code: "auth/success",
			status: 200,
			user,
			message: "Logged in successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to login user",
			error: err,
		};
	}
};

export const logoutUser = async () => {
	try {
		await auth.signOut();
		return {
			code: "auth/success",
			status: 200,
			user: null,
			message: "Logged out successfully! 🎉",
		};
	} catch (err) {
		return {
			code: "auth/failed",
			status: 500,
			user: null,
			message: "Failed to logout user",
			error: err,
		};
	}
};

export const getLeaderboard = async () => {
	try {
		const leaderboardRef = collection(db, "leaderboard");
		const q = query(leaderboardRef, orderBy("score", "desc"));

		const querySnapshot = await getDocs(q);

		const allLeaders = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return allLeaders;
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		return [];
	}
};

export const createGame = async (game: Game) => {
	const { id, type, players } = game;

	try {
		const docRef = doc(db, "games", id);
		await setDoc(docRef, {
			id,
			type,
			players,
		});
		return {
			code: "game/success",
			status: 200,
			game: { id, type, players },
			message: "Game created successfully! 🎉",
		};
	} catch (error) {
		console.error("Error creating game:", error);
		return {
			code: "game/failed",
			status: 500,
			game: null,
			message: "Failed to create game",
			error,
		};
	}
};

export const getGameById = async (id: string) => {
	try {
		const docSnap = await getDoc(doc(db, "games", id));

		if (docSnap.exists()) {
			return {
				code: "game/success",
				status: 200,
				game: docSnap.data(),
				message: "Game fetched successfully! 🎉",
			};
		} else {
			return {
				code: "game/failed",
				status: 404,
				game: null,
				message: "Game not found",
			};
		}
	} catch (error) {
		console.error("Error fetching game:", error);
		return {
			code: "game/failed",
			status: 500,
			game: null,
			message: "Failed to fetch game",
			error,
		};
	}
};

export const updatePlayerScore = async (userId: string, gameId: string) => {
	try {
		const userDocRef = doc(db, "leaderboard", userId);
		const gameDocRef = doc(db, "games", gameId);

		// Step 1: Get the current leaderboard score
		const userSnap = await getDoc(userDocRef);
		if (!userSnap.exists()) {
			throw new Error("User not found");
		}
		const userData = userSnap.data();
		const currentScore =
			typeof userData.score === "number" ? userData.score : 0;

		const leaderboardUpdate = updateDoc(userDocRef, {
			score: currentScore + 1,
		});

		// Step 2: Read game doc to update the score in the players array
		const gameSnap = await getDoc(gameDocRef);
		if (!gameSnap.exists()) {
			throw new Error("Game not found");
		}

		const gameData = gameSnap.data();
		if (!Array.isArray(gameData.players)) {
			throw new Error("Players field is invalid");
		}

		// Step 3: Efficiently update the matching player's score
		const updatedPlayers = gameData.players.map((player: any) => {
			if (player.id === userId) {
				return {
					...player,
					score: (player.score ?? 0) + 1,
				};
			}
			return player;
		});

		const gameUpdate = updateDoc(gameDocRef, {
			players: updatedPlayers,
		});

		// Step 4: Await both updates in parallel
		await Promise.all([leaderboardUpdate, gameUpdate]);

		return {
			code: "user/success",
			status: 200,
			message: "User score updated successfully! 🎉",
		};
	} catch (error) {
		console.error("Error updating player score:", error);
		return {
			code: "user/failed",
			status: 500,
			message: "Failed to update user score",
			error,
		};
	}
};
