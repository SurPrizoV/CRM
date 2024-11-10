export interface User {
  id?: string;
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface UserData {
  email: string;
  name: string;
  surname: string;
  img: string;
}

export interface FbAuthResponse {
  idToken: string;
  expiresIn: string;
  localId: string;
}

export interface Manager {
  id?: string;
  img: string;
  name: string;
  surname: string;
  email: string;
}

export interface Task {
  id?: string;
  title: string;
  subtitle: string;
  priority?: string;
  date: Date;
  duration?: string;
  responsible?: string;
  created?: string;
  createdTime?: string;
  completed: boolean;
  img: string;
}

export interface Company {
  id?: string;
  name: string;
  activity: string;
  status: string;
  managers: Manager[];
  email: string;
  phone: string;
  site: string;
  address: string;
  img?: string;
}

export interface Contact {
  id?: string;
  img: string;
  surname: string;
  name: string;
  patronymic?: string;
  jobTitle: string;
  companies: Company[];
  managers: Manager[];
  email: string;
  phone: string;
  telegram: string;
  facebook: string;
}
