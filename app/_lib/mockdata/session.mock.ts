export type Session = {
  userId: string;
  fullName: string;
  role: string;
};

export async function getCurrentSession(): Promise<Session> {
  // Troque isso pelo seu backend
  // Exemplos úteis:
  // { userId: "stu-001", fullName: "Maria Silva", role: "ALUNO" }
  // { userId: "usr-010", fullName: "Recepção UNIENF", role: "RECEPCAO" }
  // { userId: "usr-011", fullName: "Administrativo UNIENF", role: "ADMINISTRATIVO" }

  return { userId: "stu-001", fullName: "Maria Silva", role: "aluno" };
}
