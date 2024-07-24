export interface DataObject {
  [key: string]: LocaleObj
}
export interface LocaleObj {
  [key: string]: RouteObj
}
export interface RouteObj {
  [key: string]: SubRouteObj
}
export interface SubRouteObj {
  [key: string]: Array<string>
}

export interface LanguageObj {
  language: string,
  setLanguage: Function,
  previousPath: Array<string>,
  setPreviousPath: Function
}

export interface ApiResponse {
  error: boolean,
  message: string,
  data: any //TODO: laita oikea tietorakenne
}
