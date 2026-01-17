export interface ProgrammingLanguage {
  id: string;
  name: string;
  added_by: string | null;
}

export interface CreateLanguagePayload {
  name: string;
}
