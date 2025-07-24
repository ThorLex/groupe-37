interface PreEnrollData {
  firstName: string
  lastName: string
  birthDate: string
  profession: string
  gender: 'M' | 'F'
  fatherName: string
  motherName: string
  city: string
  neighborhood: string
  email: string
  contact1: string
  contact2?: string
  birthAct: File
  nationalityCert: File
  photo: File
}