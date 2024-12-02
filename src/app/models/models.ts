// Interface Alumne
export interface Alumne {
  id: string;
  nom: string;
  mostrarMenu?: boolean;  // Propietat opcional per mostrar el menú
  notes: Nota[]; // Afegeix les notes de l'alumne
}

export interface Competencia {
  codi: string,
  nom: string,
  descripcio: string
}

// Interface Activitat
export interface Activitat {
  id: string;
  nom: string;
  descripcio: string;
  data: Date;
  competencies: Competencia[]
}

export interface Materia {
  _id: string;
  nom: string;
  competencies: Competencia[]; // Competències associades a la matèria
}

// Interface Assignatura
export interface Assignatura {
  id: string;
  nom: string;
  materia: Materia; // Matèria associada a l'assignatura
  alumnes: Alumne[];
  activitats: Activitat[];
  userId?: string; // Propietat que volem eliminar
}


// Interface Nota
export interface Nota {
  activitatId: string;
  competenciaId: string;
  valor: number;
}

export interface User {
      id: number;
      nom: string;
      email: string;
      password: string
}

