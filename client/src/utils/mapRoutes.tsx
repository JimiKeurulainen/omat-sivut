import { Route } from "react-router-dom"
import App from "../components/App"
import { DataObject, LocaleObj, RouteObj, SubRouteObj } from "../types/types";


export function mapRoutes(data: DataObject) {
  console.log('ROUTES', data);
  const routes = Object.values(data).map((locale: LocaleObj, index1: number) => {
    // Map locales
    return (<Route path={Object.keys(data)[index1]} element={<App />} key={'locale' + Object.keys(data)[index1]}>
      {Object.values(locale).map((route: RouteObj, index2: number) => {
      // Map main routes

        return (<Route path={Object.keys(locale)[index2]} element={<App />} key={'route' + Object.keys(locale)[index2]}>
        {Object.values(route).length > 0 && Object.values(route).map((subroute: SubRouteObj, index3: number) => {

          // Map subroutes
          if (Object.values(subroute).length > 0) {
            return (<Route path={Object.keys(route)[index3]} element={<App />} key={'subroute' + subroute}>
              {Object.values(subroute).length > 0 && Object.values(subroute).map((file: Array<string>) => {
                // Map files
                return <Route path={file.toString()} element={<App />} key={'fileRoute' + file} />
              })}
            </Route>);
          }
          else {
            return null;
          }
        })}
        </Route>)
    })}
    </Route>
    )
  });

  return routes;
}