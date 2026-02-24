export type ProcSignalType = "absence" | "misalignment" | "contradiction" | "compression";
export type ProcSeverity = "low" | "medium" | "high";

export type EvidenceRef = {
  fileId: string;        // core_files._id as string
  chunkId?: string;      // core_file_chunks._id as string
  excerpt?: string;
};

export type ProcSignal = {
  type: ProcSignalType;
  severity: ProcSeverity;
  description: string;
  evidenceRefs: EvidenceRef[];
};
