// Utility functions for managing saved jobs in Firebase Firestore
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

export interface SavedJob {
  jobId: number;
  employerId: number;
  employerName: string;
  jobTitle: string;
  locationName: string;
  minimumSalary?: number;
  maximumSalary?: number;
  currency?: string;
  expirationDate: string;
  date: string;
  jobDescription: string;
  jobUrl: string;
  savedAt: string; // Timestamp when the job was saved
  userId?: string; // User ID who saved the job
  docId?: string; // Firestore document ID
}

const SAVED_JOBS_COLLECTION = "savedJobs";

/**
 * Get all saved jobs for the current user from Firestore
 */
export const getSavedJobs = async (): Promise<SavedJob[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return [];
    }

    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const jobs: SavedJob[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        ...data,
        docId: doc.id,
        savedAt: data.savedAt?.toDate?.()?.toISOString() || data.savedAt,
      } as SavedJob);
    });

    // Sort by savedAt descending (newest first)
    jobs.sort(
      (a, b) =>
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );

    return jobs;
  } catch (error) {
    console.error("Error reading saved jobs:", error);
    return [];
  }
};

/**
 * Save a job to Firestore
 */
export const saveJob = async (
  job: Omit<SavedJob, "savedAt" | "userId" | "docId">
): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User must be logged in to save jobs");
      return false;
    }

    // Check if job is already saved
    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where("userId", "==", user.uid),
      where("jobId", "==", job.jobId)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Job already saved");
      return false; // Job already saved
    }

    // Clean job data - remove undefined values
    const cleanJobData = Object.fromEntries(
      Object.entries(job).filter(([_, value]) => value !== undefined)
    );

    // Add new job
    await addDoc(collection(db, SAVED_JOBS_COLLECTION), {
      ...cleanJobData,
      userId: user.uid,
      savedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error saving job:", error);
    return false;
  }
};

/**
 * Remove a saved job from Firestore
 */
export const unsaveJob = async (jobId: number): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User must be logged in");
      return false;
    }

    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where("userId", "==", user.uid),
      where("jobId", "==", jobId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Job not found in saved jobs");
      return false;
    }

    // Delete all matching documents (should only be one)
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, SAVED_JOBS_COLLECTION, document.id))
    );

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error removing saved job:", error);
    return false;
  }
};

/**
 * Check if a job is saved
 */
export const isJobSaved = async (jobId: number): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where("userId", "==", user.uid),
      where("jobId", "==", jobId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if job is saved:", error);
    return false;
  }
};

/**
 * Clear all saved jobs for the current user
 */
export const clearAllSavedJobs = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, SAVED_JOBS_COLLECTION, document.id))
    );

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error clearing saved jobs:", error);
    return false;
  }
};
