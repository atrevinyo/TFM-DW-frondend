// Interface Assignatura
export interface Assignatura {
  id: string;
  nom: string;
  materia: Materia;
  alumnes: Alumne[];
  activitats: Activitat[];
  userId?: string;
}

// Interface Materia
export interface Materia {
  _id: string;
  nom: string;
  competencies: Competencia[];
}

export interface Alumne {
  id: string;
  nom: string;
  mostrarMenu?: boolean;  // Propietat opcional per mostrar el menú
  notes: Nota[]; 
}

// Interface Nota
export interface Nota {
  activitatId: string;
  competenciaId: string;
  valor: number;
}

// Interface Activitat
export interface Activitat {
  id: string;
  nom: string;
  descripcio: string;
  data: Date;
  competencies: Competencia[]
}

export interface Competencia {
  codi: string,
  nom: string,
  descripcio: string
}
// Interface Usuari
export interface User {
      id: number;
      nom: string;
      email: string;
      password: string
}

