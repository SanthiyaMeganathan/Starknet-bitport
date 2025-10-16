// src/services/firebaseService.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// =============================
// SAVINGS GOALS
// =============================

export const getSavingsGoals = async (walletAddress) => {
  try {
    const q = query(
      collection(db, "savings"),
      where("owner", "==", walletAddress),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error fetching savings goals:', err);
    return [];
  }
};

export const addSavingsGoal = async (walletAddress, goalData) => {
  try {
    const docRef = await addDoc(collection(db, "savings"), {
      owner: walletAddress,
      name: goalData.name,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: 0,
      deadline: goalData.deadline || null,
      createdAt: serverTimestamp(),
      status: 'active'
    });
    console.log('Savings goal added:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('Error adding savings goal:', err);
    throw err;
  }
};

export const updateSavingsGoal = async (goalId, updates) => {
  try {
    const goalRef = doc(db, "savings", goalId);
    await updateDoc(goalRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Savings goal updated:', goalId);
  } catch (err) {
    console.error('Error updating savings goal:', err);
    throw err;
  }
};

export const deleteSavingsGoal = async (goalId) => {
  try {
    await deleteDoc(doc(db, "savings", goalId));
    console.log('Savings goal deleted:', goalId);
  } catch (err) {
    console.error('Error deleting savings goal:', err);
    throw err;
  }
};

export const contributeSavings = async (goalId, amount) => {
  try {
    const goalRef = doc(db, "savings", goalId);
    const goalSnapshot = await getDocs(query(collection(db, "savings"), where("__name__", "==", goalId)));
    
    if (!goalSnapshot.empty) {
      const currentGoal = goalSnapshot.docs[0].data();
      const newAmount = currentGoal.currentAmount + parseFloat(amount);
      
      await updateDoc(goalRef, {
        currentAmount: newAmount,
        updatedAt: serverTimestamp()
      });
      
      // Check if goal is reached
      if (newAmount >= currentGoal.targetAmount) {
        await updateDoc(goalRef, {
          status: 'completed',
          completedAt: serverTimestamp()
        });
        
        // Award badge for completing savings goal
        await unlockBadge(currentGoal.owner, 'savings_master', 'Completed first savings goal!');
      }
    }
  } catch (err) {
    console.error('Error contributing to savings:', err);
    throw err;
  }
};

// =============================
// GIFTS / TRANSACTIONS
// =============================

export const getGifts = async (walletAddress) => {
  try {
    const q = query(
      collection(db, "gifts"),
      where("sender", "==", walletAddress),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error fetching gifts:', err);
    return [];
  }
};

export const addGift = async (giftData) => {
  try {
    const docRef = await addDoc(collection(db, "gifts"), {
      sender: giftData.sender,
      recipient: giftData.recipient,
      amount: parseFloat(giftData.amount),
      message: giftData.message || '',
      txId: giftData.txId || '',
      nftMinted: false,
      timestamp: serverTimestamp(),
      status: 'completed'
    });
    
    console.log('Gift recorded:', docRef.id);
    
    // Check for first gift badge
    const userGifts = await getGifts(giftData.sender);
    if (userGifts.length === 1) {
      await unlockBadge(giftData.sender, 'first_gift', 'Sent your first BTC gift!');
    }
    
    // Check for generous giver badge (5+ gifts)
    if (userGifts.length >= 5) {
      await unlockBadge(giftData.sender, 'generous_giver', 'Sent 5+ BTC gifts!');
    }
    
    return docRef.id;
  } catch (err) {
    console.error('Error adding gift:', err);
    throw err;
  }
};

// =============================
// BADGES / ACHIEVEMENTS
// =============================

export const getBadges = async (walletAddress) => {
  try {
    const q = query(
      collection(db, "badges"),
      where("owner", "==", walletAddress),
      orderBy("unlockedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error fetching badges:', err);
    return [];
  }
};

export const unlockBadge = async (walletAddress, badgeType, description) => {
  try {
    // Check if badge already exists
    const q = query(
      collection(db, "badges"),
      where("owner", "==", walletAddress),
      where("type", "==", badgeType)
    );
    const existingBadges = await getDocs(q);
    
    if (!existingBadges.empty) {
      console.log('Badge already unlocked:', badgeType);
      return null;
    }
    
    // Badge metadata
    const badgeMetadata = {
      first_gift: { name: '🎁 First Gift', emoji: '🎁' },
      generous_giver: { name: '💝 Generous Giver', emoji: '💝' },
      savings_master: { name: '💰 Savings Master', emoji: '💰' },
      early_adopter: { name: '🚀 Early Adopter', emoji: '🚀' },
      bridge_explorer: { name: '🌉 Bridge Explorer', emoji: '🌉' }
    };
    
    const metadata = badgeMetadata[badgeType] || { name: badgeType, emoji: '🏅' };
    
    const docRef = await addDoc(collection(db, "badges"), {
      owner: walletAddress,
      type: badgeType,
      name: metadata.name,
      emoji: metadata.emoji,
      description: description,
      unlocked: true,
      unlockedAt: serverTimestamp()
    });
    
    console.log('Badge unlocked:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('Error unlocking badge:', err);
    throw err;
  }
};

// =============================
// SOCIAL FEED
// =============================

export const getSocialFeed = async (limit = 20) => {
  try {
    const q = query(
      collection(db, "socialFeed"),
      orderBy("timestamp", "desc"),
      limit(limit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error fetching social feed:', err);
    return [];
  }
};

export const addSocialFeedItem = async (feedData) => {
  try {
    const docRef = await addDoc(collection(db, "socialFeed"), {
      user: feedData.user,
      action: feedData.action, // 'gift_sent', 'goal_completed', 'badge_unlocked'
      message: feedData.message,
      emoji: feedData.emoji || '🎉',
      timestamp: serverTimestamp()
    });
    console.log('Social feed item added:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('Error adding social feed item:', err);
    throw err;
  }
};

// =============================
// USER STATS / ANALYTICS
// =============================

export const getUserStats = async (walletAddress) => {
  try {
    const [gifts, savings, badges] = await Promise.all([
      getGifts(walletAddress),
      getSavingsGoals(walletAddress),
      getBadges(walletAddress)
    ]);
    
    const totalGiftsSent = gifts.length;
    const totalBTCGifted = gifts.reduce((sum, gift) => sum + gift.amount, 0);
    const activeSavingsGoals = savings.filter(g => g.status === 'active').length;
    const completedSavingsGoals = savings.filter(g => g.status === 'completed').length;
    const totalBadges = badges.length;
    
    return {
      totalGiftsSent,
      totalBTCGifted,
      activeSavingsGoals,
      completedSavingsGoals,
      totalBadges,
      lastActivity: gifts[0]?.timestamp || null
    };
  } catch (err) {
    console.error('Error fetching user stats:', err);
    return {
      totalGiftsSent: 0,
      totalBTCGifted: 0,
      activeSavingsGoals: 0,
      completedSavingsGoals: 0,
      totalBadges: 0,
      lastActivity: null
    };
  }
};