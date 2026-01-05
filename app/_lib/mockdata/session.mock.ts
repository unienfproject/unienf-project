export type Session = {
  userId: string;
  fullName: string;
  role: string;
};

export async function getCurrentSession(): Promise<Session> {
  return { userId: "stu-001", fullName: "Maria Silva", role: "aluno" };
}
