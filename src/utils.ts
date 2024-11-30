import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Auth } from "firebase/auth";
import { input } from "../constants";

async function signIn(email: string, password: string, auth: Auth) {
  if (email === "" || password === "") {
    console.log("User creds not entered.");
    return;
  }

  let ret: any = undefined;

  try {
    let user = await createUserWithEmailAndPassword(auth, email, password);
    ret = {
      user,
    };
  } catch (error) {
    console.log(error);
    ret = undefined;
  }

  //return
  return ret;
}

async function logIn(email: string, password: string, auth: Auth) {
  if (email === "" || password === "") {
    console.log("User creds not entered.");
    return;
  }

  let ret: any = undefined;

  try {
    let userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    ret = {
      user: userCredential.user,
    };
  } catch (error) {
    console.log(error);
    ret = undefined;
  }

  //return
  return ret;
}

const getBestMove = (
  board: input,
  aiTurn: string,
  opponentTurn: string,
  wins: number[][]
): number | null => {
  const emptyCells = Object.keys(board)
    .map(Number)
    .filter((index) => board[index].val === "");

  // Helper to check for winning move
  const findWinningMove = (turn: string): number | null => {
    for (let win of wins) {
      const [a, b, c] = win;
      const values = [board[a].val, board[b].val, board[c].val];
      if (
        values.filter((v) => v === turn).length === 2 &&
        values.includes("")
      ) {
        return win[values.indexOf("")];
      }
    }
    return null;
  };

  // Check for AI's winning move
  const winningMove = findWinningMove(aiTurn);
  if (winningMove !== null) return winningMove;

  // Block opponent's winning move
  const blockMove = findWinningMove(opponentTurn);
  if (blockMove !== null) return blockMove;

  // Pick center if available
  if (board[4].val === "") return 4;

  // Pick corners if available
  const corners = [0, 2, 6, 8];
  const emptyCorners = corners.filter((index) => board[index].val === "");
  if (emptyCorners.length > 0) return emptyCorners[0];

  // Pick any empty side
  if (emptyCells.length > 0) return emptyCells[0];

  // No moves left
  return null;
};

export { signIn, logIn, getBestMove };
