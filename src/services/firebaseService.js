// src/services/firebaseService.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// --- Get user badges ---
export const getBadges = async (address) => {
  const querySnapshot = await getDocs(collection(db, "badges"));
  const allBadges = querySnapshot.docs.map((doc) => doc.data());
  // Filter badges by user address if needed
  return allBadges.filter(badge => badge.owner === address);
};

// --- Get savings goals ---
export const getSavingsGoals = async (address) => {
  const querySnapshot = await getDocs(collection(db, "savings"));
  const allGoals = querySnapshot.docs.map((doc) => doc.data());
  return allGoals.filter(goal => goal.owner === address);
};

// --- Get gifts ---
export const getGifts = async (address) => {
  const querySnapshot = await getDocs(collection(db, "gifts"));
  const allGifts = querySnapshot.docs.map((doc) => doc.data());
  return allGifts.filter(gift => gift.sender === address);
};

// --- Get social feed ---
export const getSocialFeed = async () => {
  const querySnapshot = await getDocs(collection(db, "socialFeed"));
  return querySnapshot.docs.map((doc) => doc.data());
};
