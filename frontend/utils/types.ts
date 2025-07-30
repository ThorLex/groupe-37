export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export type Document = {
  type: string;
  url: string;
};

export interface Request {
  id: string;
  fullName: string;
  cinNumber: string;
  birthdate: string;
  fathername: string;
  father_profession: string;
  mothername: string;
  mother_profession: string;
  profession: string;
  contact1: string;
  genre: string;
  city: string;
  createdAt: string;
  neighborhood: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  biometricdate?: string;
  biometric_passed?: boolean;
  documents: { type: string; url: string }[];
  rejection_reason?: string;
  locationcni?: string;
  cniPicked?: boolean;
}